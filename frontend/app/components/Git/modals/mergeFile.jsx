import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { dispatchCommand } from '../../../commands'
import cx from 'classnames'
import { connect } from 'react-redux'
import * as GitActions from '../actions'
import i18n from 'utils/createI18n'


// CodeMirror
import CodeMirror from 'codemirror'
require(['diff_match_patch'], (lib) => {
  Object.assign(window, lib)  // @fixme: diff_match_patch is now exposed into the global ns
  require(['codemirror/addon/merge/merge.js'])
})
import 'codemirror/addon/merge/merge.css'

class GitMergeView extends Component {
  static defaultProps = {
    mode: null,
    height: '100%',
    width: '100%',
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentWillMount () {
    this.props.getConflicts({ path: this.props.content.path }).then((res) => {
      this.setState({
        isLoading: false,
      })
      this.initMerge(res)
    })
  }

  render () {
    const { theme, content } = this.props
    let loadDiv = ''
    if (this.state.isLoading) {
      loadDiv = (
        <div className='loading'>
          <i className='fa fa-spinner fa-spin' />
        </div>
      )
    } else {
      loadDiv = ''
    }
    return (
      <div>
        <div className='git-merge'>
          <h1>
            {i18n`git.mergeFile.title`} : {this.props.content.path}
          </h1>
          <hr />
          <div className='diffModal'>
            <div className='mergeTitle'>
              <div>
                {i18n`git.mergeFile.local`}
              </div>
              <div className='gutterTitle' />
              <div>
                {i18n`git.mergeFile.result`}
              </div>
              <div className='gutterTitle' />
              <div>
                {i18n`git.mergeFile.remote`}
              </div>
            </div>
            <div
              id='flex-container'
              className='mergeContainer'
            >
              <div id='cm-merge-view-wrapper' ref={r => this.editorDOM = r}  />
            </div>
            { loadDiv }
          </div>
          <hr />
          <div className='modal-ops'>
            <button className='btn btn-default' onClick={this.handleCancel}>{i18n`git.cancel`}</button>
            <button className='btn btn-primary' onClick={this.handleConfirm}>{i18n`git.commit`}</button>
          </div>
        </div>
      </div>
    )
  }

  initMerge (data) {
    this.mergeView = CodeMirror.MergeView(this.editorDOM, {
      origLeft: data.local,
      orig: data.remote,
      value: data.base,
      revertButtons: true,
    })
    this.mergeView.wrap.style.height = '100%'
  }

  handleConfirm = () => {
    this.props.resolveConflict({
      path: this.props.content.path,
      content: this.mergeView.edit.getValue()
    })
  }

  handleCancel = () => {
    this.props.cancelConflict({
      path: this.props.content.path
    })
  }
}

export default GitMergeView = connect(
  state => state.GitState,
  dispatch => bindActionCreators(GitActions, dispatch)
)(GitMergeView)
