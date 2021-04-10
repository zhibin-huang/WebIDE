import BaseCodeEditor from './BaseCodeEditor2'
import addMixinMechanism from './addMixinMechanism'
import basicMixin from './mixins/basicMixin'
import gitBlameMixin from './mixins/gitBlameMixin'
import eslintMixin from './mixins/eslintMixin'
import {connectLanguageServer} from 'components/Editor/state'

class MEditor extends BaseCodeEditor {
  componentWillReceiveProps (newProps) {
    if (newProps.editor && this.editor === newProps.editor) return
    this.editor = newProps.editor
    this.me = this.editor.me
    this.meDOM = this.me.getContainerDomNode()
    this.dom.removeChild(this.dom.children[0])
    this.dom.appendChild(this.meDOM)
    this.me.focus()
  }
}
// addMixinMechanism(CodeEditor, BaseCodeEditor)

// CodeEditor.use(basicMixin)
// CodeEditor.use(gitBlameMixin)
// CodeEditor.use(eslintMixin)

export default MEditor
