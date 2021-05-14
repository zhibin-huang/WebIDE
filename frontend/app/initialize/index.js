/* eslint-disable no-await-in-loop */
import { isFunction } from 'utils/is'
import config from '../config'
import stepFactory from '../utils/stepFactory'
import i18n from 'utils/createI18n'
import state from './state'
import { persistTask } from '../mobxStore'
import { monarchLanguage, languageConf } from "../components/Editor/java-highlight"
import * as monaco from 'monaco-editor'
import { MonacoServices } from 'monaco-languageclient'
import { connectLanguageServer } from 'components/Editor/state'


function checkEnable(enable) {
  if (enable === undefined) {
    return true
  }
  if (isFunction(enable)) {
    return enable(config)
  }
  return Boolean(enable)
}

async function initialize() {
  const step = stepFactory()
  let stepNum = 1
  await step('[0] prepare data', async () => {
    window.i18n = i18n
    window.extension = f => null
    window.refs = {}
    return true
  })

  await step('=== Run steps in stepCache ===', async () => {
    for (const value of state.values()) {
      if (checkEnable(value.enable)) {
        await step(`[${stepNum++}] ${value.desc}`, value.func)
      }
    }
    console.log('=== End running stepCache ===')
    return true
  })


  await step(`[${stepNum++}] initialize monaco and lsp service`, () => {
    //register Monaco languages
    monaco.languages.register({
      id: 'java',
      extensions: ['.java'],
      aliases: ['JAVA'],
    });

    monaco.languages.onLanguage('java', () => {
      monaco.languages.setLanguageConfiguration('java', languageConf);
      monaco.languages.setMonarchTokensProvider('java', monarchLanguage);
    });

    const rootUri = `file:///${config.baseDIR}/${config.spaceKey}/working-dir`
    // install Monaco language client services
    MonacoServices.install(monaco, { rootUri: rootUri });
    connectLanguageServer()
    return true
  })

  await step(`[${stepNum++}] persist Store`, () => {
    persistTask()
    return true
  })

  return step
}

export default initialize
