import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { when } from 'mobx'
import CodeEditor from './components/CodeEditor'
import MarkdownEditor from './components/MarkdownEditor'
import ImageEditor from './components/ImageEditor'
import UnknownEditor from './components/UnknownEditor'
import WelcomeEditor from './components/WelcomeEditor'
import HtmlEditor from './components/HtmlEditor'
import config from '../../config'

const EditorWrapper = observer(({ tab, active }) => {
  const { editor } = tab
  const editorType = editor.editorType || 'default'
  const file = editor.file || {}
  // key is crutial here, it decides whether
  // the component should re-construct or
  // keep using the existing instance.
  const key = `editor_${file.path}`
  switch (editorType) {
    case 'htmlEditor':
      return React.createElement(HtmlEditor, { editor, key, tab, active })
    case 'default':
      return React.createElement(CodeEditor, { editor, key, tab, active })
    case 'editorWithPreview':
      return React.createElement(MarkdownEditor, { editor, key, tab, active })
    case 'imageEditor':
      return React.createElement(ImageEditor, { path: file.path, key, tab, active })
    default:
      return React.createElement(UnknownEditor, { path: file.path, size: file.size, key, tab, active })
  }
})

EditorWrapper.propTypes = {
  tab: PropTypes.object
}

EditorWrapper.contextTypes = {
  i18n: PropTypes.func
}

export default EditorWrapper
