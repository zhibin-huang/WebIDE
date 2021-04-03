import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { dispatchCommand } from '../../../commands'
import cx from 'classnames'
import { connect } from 'react-redux'
import i18n from 'utils/createI18n'

import * as GitActions from '../actions'

const actionOptions = [
  'SOFT',
  'MIXED',
  'HARD',
]

class GitResetView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      resetType: 'MIXED',
      commit: 'HEAD',
    }
    this.handleChangeOption = this.handleChangeOption.bind(this)
    this.handleCommitChange = this.handleCommitChange.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }
  render () {
    const { branches: {current: currentBranch} } = this.props
    return (
      <div>
        <div className='git-reset-container'>
          <h1>
          {i18n`git.reset.title`}
          </h1>
          <hr />
          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 control-label">{i18n`git.reset.currentBranch`}</label>
              <label className="col-sm-9 checkbox-inline">
                {currentBranch}
              </label>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label">{i18n`git.reset.type`}</label>
              <label className="col-sm-3">
                {this.renderOptions()}
              </label>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label">{i18n`git.reset.toCommit`}</label>
              <label className="col-sm-9">
                <input type="text"
                  className="form-control"
                  value={this.state.commit}
                  onChange={this.handleCommitChange}/>
              </label>
            </div>
          </form>
          <hr />
          <div className='modal-ops'>
            <button className='btn btn-default' onClick={e => dispatchCommand('modal:dismiss')}>{i18n`git.cancel`}</button>
            <button className='btn btn-primary' onClick={this.handleConfirm} disabled={!this.state.commit}>{i18n`git.commit`}</button>
          </div>
        </div>
      </div>
    )
  }

  renderOptions () {
    return (
      <select
        className="form-control"
        onChange={this.handleChangeOption}
        value={this.state.resetType}
        >
        {
          actionOptions.map( (item, i) => {
            return (
              <option
                key={i}
                value={item}>
                {item}
              </option>
            )
          })
        }
      </select>
    )
  }

  handleChangeOption (e) {
    this.setState({resetType: e.target.value})
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  handleCommitChange (e) {
    this.setState({commit: e.target.value})
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  handleConfirm (e) {
    this.props.resetHead({
      ref: this.state.commit,
      resetType: this.state.resetType,
    })
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }
}

export default GitResetView = connect(
  state => state.GitState,
  dispatch => bindActionCreators(GitActions, dispatch)
)(GitResetView)
