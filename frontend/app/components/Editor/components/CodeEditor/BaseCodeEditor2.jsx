import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor} from 'components/Editor/state'

class BaseCodeEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    let { editor } = props
    if (!editor) editor = new Editor()
    this.editor = editor
    this.me = this.editor.me
    this.meDOM = this.me.getContainerDomNode()
  }

  componentDidMount () {
    this.dom.appendChild(this.meDOM)  
    this.me.focus()
  }

  render () {
    return (
      <div ref={r => this.dom = r} style={{ width: '100%', height: '100%' }} />
    )
  }

  componentWillUnmount () {
    const async = true
    this.editor.destroy(async)
    
  }
}

BaseCodeEditor.propTypes = {
  editor: PropTypes.shape({
    file: PropTypes.shape({
      content: PropTypes.string,
    }),
    options: PropTypes.any,
    me: PropTypes.any,
  }),
}

export default BaseCodeEditor
