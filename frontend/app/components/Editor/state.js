import uniqueId from 'lodash/uniqueId'
import is from 'utils/is'
import getTabType from 'utils/getTabType'
import assignProps from 'utils/assignProps'
import { reaction, observe, observable, computed, action, autorun, extendObservable } from 'mobx'
import CodeMirror from 'codemirror'
import FileStore from 'commons/File/store'
import TabStore from 'components/Tab/store'
import overrideDefaultOptions from './codemirrorDefaultOptions'
import { loadMode } from './components/CodeEditor/addons/mode'
import { findModeByFile, findModeByMIME, findModeByName } from './components/CodeEditor/addons/mode/findMode'
import * as monaco from 'monaco-editor'
import { MonacoLanguageClient, CloseAction, ErrorAction, createConnection } from 'monaco-languageclient'
import { listen } from '@codingame/monaco-jsonrpc'
import ReconnectingWebSocket from 'reconnecting-websocket'
import path from 'utils/path'
import config from 'config.js'

function connectLanguageServer() {
  // create the web socket
  const url = 'ws://localhost:4000/java-lsp';
  const webSocket = createWebSocket(url);
  let disposable ;
  // listen when the web socket is opened
  listen({
    webSocket,
    onConnection: connection => {
      // create and start the language client
      const languageClient = createLanguageClient(connection);
      disposable = languageClient.start();
      console.log("languageclient started!");
      connection.onClose(() => disposable.dispose());
    }
  });

  function createLanguageClient(connection) {
    return new MonacoLanguageClient({
      name: "Java Language Client",
      clientOptions: {
        // use a language id as a document selector
        documentSelector: ['java'],
        // disable the default error handler
        errorHandler: {
          error: () => ErrorAction.Continue,
          closed: () => CloseAction.DoNotRestart
        }
      },
      // create a language client connection from the JSON RPC connection on demand
      connectionProvider: {
        get: (errorHandler, closeHandler) => {
          return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
        }
      }
    });
  }

  function createWebSocket(url) {
    const socketOptions = {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 10000,
      maxRetries: Infinity,
      debug: false
    };
    return new ReconnectingWebSocket(url, [], socketOptions);
  }

  return disposable;
}

const typeDetect = (title, types) => {
  // title is the filename
  // typeArray is the suffix
  if (!Array.isArray(types)) return title.endsWith(`.${types}`)
  return types.reduce((p, v) => p || title.endsWith(`.${v}`), false)
}


const defaultOptions = { ...CodeMirror.defaults, ...overrideDefaultOptions }
const defaultMeOptions = {
  glyphMargin: true,
  lightbulb: {
    enabled: true
  },
  language: 'java',
  automaticLayout: true
}

const state = observable({
  entities: observable.map({}),
  options: observable.shallow(defaultOptions),
  meOptions: observable.shallow(defaultMeOptions),
})

state.entities.observe((change) => {
  if (change.type === 'delete') {
    const editor = change.oldValue
    if (editor.dispose) editor.dispose()
  }
})


class Editor {
  constructor(props = {}) {
    this.id = props.id || uniqueId('editor_')
    state.entities.set(this.id, this)
    this.update(props)
    console.log(this.id, props.filePath)
    if (!props.filePath || this.isCM) {
      this.createCodeMirrorInstance()
    }
    if (this.isME) {
      this.createMonacoEditorInstance()
    }
  }

  disposers = []

  createMonacoEditorInstance() {
    this.meDOM = document.createElement('div')
    Object.assign(this.meDOM.style, { width: '100%', height: '100%' })
    const me = monaco.editor.create(this.meDOM, defaultMeOptions)
    this.me = me
    me._editor = this

    this.setOption = (option, value) => {
      this._meOptions.set(option, value)
    }

    const setMeOption = this.me.updateOptions.bind(this.me)
    this.disposers.push(autorun(() => {
      const options = Object.entries(this.meOptions)
      options.forEach(([option, value]) => {
        if (this.me.getOption(option) === value) return
        setMeOption({ option: value })
      })
    }))

    this.disposers.push(observe(this, 'content', (change) => {
      const content = change.newValue || ''
      if (content !== me.getValue()) me.setValue(content)
    }))

    if (this.content) {
      if(this.filePath){
        const rootUri = `file:///${config.baseDIR}/${config.spaceKey}/working-dir`
        const rootUriParsed = monaco.Uri.parse(rootUri);
        const completePath = path.join(rootUriParsed.path, this.filePath)
        const uriParsed = monaco.Uri.parse(`file://${completePath}`)
        let model = monaco.editor.getModel(uriParsed);
        if (!model) {
          model = monaco.editor.createModel(this.content, 'java', uriParsed);
        }
        me.setModel(model)
      }
      else me.setValue(this.content)
    }

    me.onDidChangeCursorPosition((e) => {
      this.cursorPosition = {
        ln: e.position.lineNumber,
        col: e.position.column
      }
    })
  }

  //TODO
  set theme(theme) {

  }

  @computed get theme() {

  }

  createCodeMirrorInstance() {
    this.cmDOM = document.createElement('div')
    Object.assign(this.cmDOM.style, { width: '100%', height: '100%' })
    const cm = CodeMirror(this.cmDOM, this.options)
    this.cm = cm
    cm._editor = this
    const setOption = this.cm.setOption.bind(this.cm)
    this.cm.setOption = this.setOption = (option, value) => {
      this._options.set(option, value)
    }

    this.disposers.push(autorun(() => {
      const options = Object.entries(this.options)
      options.forEach(([option, value]) => {
        if (this.cm.options[option] === value) return
        setOption(option, value)
      })
    }))

    this.disposers.push(observe(this, 'content', (change) => {
      const content = change.newValue || ''
      if (content !== cm.getValue()) cm.setValue(content)
    }))

    this.disposers.push(reaction(() => {
      if (this.tab && this.tab.isActive) return this.tab
    }, (activeTab) => {
      if (!activeTab) return
      if (activeTab.editor && activeTab.editor.cm) {
        setTimeout(() => {
          activeTab.editor.cm.refresh()
          activeTab.editor.cm.focus()
        }, 1)
      }
    }))
    // 1. set value
    if (this.content) {
      cm.setValue(this.content)
      cm.clearHistory()
      const scrollLine = this.scrollLine || 0
      if (scrollLine > 0) {
        cm.scrollIntoView({ line: scrollLine, ch: 0 })
        // cm.setCursor({ line: scrollLine - 1, ch: 0 })
      }
      cm.focus()
    }

    autorun(() => {
      const cursorLine = this.cursorLine || 0
      if (cursorLine > 0) {
        cm.scrollIntoView({ line: cursorLine - 1, ch: 0 })
        cm.setCursor({ line: cursorLine - 1, ch: 0 })
      }
    })

    if (!this.file) {
      cm.setCursor(cm.posFromIndex(this.content.length))
    }
    // 2. set mode
    const modeInfo = findModeByFile(this.file)
    if (modeInfo) {
      this.modeInfo = modeInfo
      loadMode(modeInfo.mode).then(() => this.options.mode = modeInfo.mime)
    }
    // 3. sync cursor state to corresponding editor properties
    cm.on('cursorActivity', () => {
      this.selections = cm.getSelections()
      const { line, ch } = cm.getCursor()
      this.cursorPosition = {
        ln: line + 1,
        col: ch + 1,
      }
    })
  }

  @observable selections = []
  @observable cursorPosition = { ln: 1, col: 1 }


  setCursor(...args) {
    if (!args[0]) return
    const lineColExp = args[0]
    if (is.string(lineColExp)) {
      const [line = 0, ch = 0] = lineColExp.split(':')
      args = [line - 1, ch - 1]
    }
    this.cm.setCursor(...args)
    setTimeout(() => this.cm.focus())
  }

  @computed get mode() {
    if (!this.options.mode) return ''
    const modeInfo = findModeByMIME(this.options.mode)
    return modeInfo.name
  }

  setMode(mode) {
    const modeInfo = is.string(mode) ? findModeByName(mode) : mode
    this.options.mode = modeInfo.mime
  }

  setEncoding(encoding) {
    return FileStore.syncFile({ path: this.filePath, encoding })
  }

  @action update(props = {}) {
    // simple assignments
    extendObservable(this, props)
    assignProps(this, props, {
      tabId: String,
      filePath: String,
      gitBlame: Object,
    })
    // filenode未获取，但构造传递了content时
    if (!this.file && props.content) {
      this._content = props.content
    }
    // 构造传递了editor实例时
    if (props.cm instanceof CodeMirror) this.cm = props.cm
    if (props.me) this.me = props.me
  }

  @observable _options = observable.map({})
  @computed get options() {
    const options = { ...state.options, ...this._options.toJS() }
    const self = this
    const descriptors = Object.entries(options).reduce((acc, [key, value]) => {
      acc[key] = {
        enumerable: true,
        get() { return value },
        set(v) { self._options.set(key, v) },
      }
      return acc
    }, {})
    return Object.defineProperties({}, descriptors)
  }
  set options(value) {
    this._options = observable.map(value)
  }

  @observable _meOptions = observable.map({})
  @computed get meOptions() {
    const options = { ...state.meOptions, ...this._meOptions.toJS() }
    const self = this
    const descriptors = Object.entries(options).reduce((acc, [key, value]) => {
      acc[key] = {
        enumerable: true,
        get() { return value },
        set(v) { self._meOptions.set(key, v) },
      }
      return acc
    }, {})
    return Object.defineProperties({}, descriptors)
  }
  set meOptions(value) {
    this._meOptions = observable.map(value)
  }

  @observable tabId = ''
  @computed get tab() {
    return TabStore.getTab(this.tabId)
  }

  @observable filePath = undefined
  @computed get file() {
    return FileStore.get(this.filePath)
  }

  @observable _content = ''
  @computed get content() {
    return this.file ? this.file.content : this._content
  }
  set content(v) { this._content = v }

  @computed get revision() {
    return this.file ? this.file.revision : null
  }

  @observable gitBlame = {
    show: false,
    data: observable.ref([]),
  }

  @computed
  get editorType() {
    let type = 'default'
    if (!this.file) return type
    if (this.file.contentType) {
      if (getTabType(this.file) === 'IMAGE') {
        type = 'imageEditor'
      } else if (getTabType(this.file) === 'UNKNOWN') {
        type = 'unknownEditor'
      }
    }
    if (this.file.contentType === 'text/html') {
      type = 'htmlEditor'
    } else if (typeDetect(this.file.name, 'md')) {
      type = 'editorWithPreview'
    }
    if (typeDetect(this.file.name, ['png', 'jpg', 'jpeg', 'gif'])) {
      type = 'imageEditor'
    }
    return type
  }

  //markdown 和 html 暂用codemirror
  @computed
  get isCM() {
    return this.editorType === 'editorWithPreview' || this.editorType === 'htmlEditor'
  }

  //default使用monaco
  @computed
  get isME() {
    return this.editorType === 'default'
  }

  dispose() {
    console.log("disposers dispose!")
    this.disposers.forEach(disposer => disposer && disposer())
  }

  destroyMonaco() {
    if(this.me){
      if(this.me.getModel()){
        this.me.getModel().dispose();
      }
      this.me.dispose();
      this.me = null;
    }
  }

  destroy(async) {
    if (async) {
      setTimeout(() => {
        if (this.tab) return
        this.dispose()
        this.destroyMonaco()
        state.entities.delete(this.id)
      }, 1000)
    } else {
      this.dispose()
      this.destroyMonaco()
      state.entities.delete(this.id)
    }
  }
}

export default state
export { state, Editor, connectLanguageServer }
