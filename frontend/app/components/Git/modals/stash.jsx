import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { dispatchCommand } from '../../../commands'
import cx from 'classnames'
import { connect } from 'react-redux'
import i18n from 'utils/createI18n'

import * as GitActions from '../actions'

class GitStashView extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const { branches, updateStashMessage, createStash } = this.props
    const { current: currentBranch} = branches
    const { stashMessage } = this.props.stash
    return (
      <div>
        <div className='git-stash-container'>
          <h1>
            {i18n`git.stash.title`}
          </h1>
          <hr />
          <div className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 control-label">{i18n`git.stash.currentBranch`}</label>
              <label className="col-sm-9 checkbox-inline">
                {currentBranch}
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="inputStashName" className="col-sm-3 control-label">{i18n`git.stash.commitMessage`}</label>
              <div className="col-sm-9">
                <input type="text"
                  className="form-control"
                  id="inputStashName"
                  placeholder={i18n.get('git.stash.placeholder')}
                  onChange={e => {
                    updateStashMessage(e.target.value);
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onKeyDown={e => {if (e.keyCode === 13) createStash(stashMessage)}}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className='modal-ops'>
            <button className='btn btn-default' onClick={e => dispatchCommand('modal:dismiss')}>{i18n`git.cancel`}</button>
            <button className='btn btn-primary' onClick={e => createStash(stashMessage)}>{i18n`git.commit`}</button>
          </div>
        </div>
      </div>
    )
  }
}

export default GitStashView = connect(
  state => state.GitState,
  dispatch => bindActionCreators(GitActions, dispatch)
)(GitStashView)
