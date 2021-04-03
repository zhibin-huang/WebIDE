import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { dispatchCommand } from '../../commands'
import cx from 'classnames'
import { connect } from 'react-redux'

import * as GitActions from './actions'
import Menu from '../Menu'
import i18n from 'utils/createI18n'


// add withRef to deliver ref to the wrapperedcomponent
@connect(state => state.GitState.branches,
  dispatch => bindActionCreators(GitActions, dispatch), null, { withRef: true })
export default class GitBranchWidget extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
  }

  componentWillMount () {
    this.props.getCurrentBranch()
  }

  render () {
    const { current: currentBranch, local: localBranches, remote: remoteBranches } = this.props
    return (
      <div className='status-bar-menu-item'
        onClick={e => { this.toggleActive(true, true) }}
      >
        <span>
          <span className='fa fa-code-fork' style={{ fontWeight: 800, marginRight: '5px' }} />
          {currentBranch}
        </span>
        {this.state.isActive ?
          <div className='git-branch-widget'>
            <Menu className={cx('bottom-up to-left', { active: this.state.isActive })}
              style={{
                position: 'relative',
                border: 0,
              }}
              items={this.makeBrancheMenuItems(localBranches, remoteBranches)}
              deactivate={this.toggleActive.bind(this, false)}
            />
          </div>
        : null}
      </div>
    )
  }

  toggleActive (isActive, isTogglingEnabled) {
    if (isTogglingEnabled) { isActive = !this.state.isActive }
    if (isActive) {
      this.props.getBranches()
    }
    this.setState({ isActive })
  }

  makeBrancheMenuItems (localBranches, remoteBranches) {
    if (!localBranches && !remoteBranches) {
      return [{ name: i18n.get('git.branchWidget.fetchingBranches'), isDisabled: true }]
    }

    const localBranchItems = localBranches.map(branch => ({
      name: branch,
      icon: 'fa',
      items: [{
        name: i18n.get('git.branchWidget.checkout'),
        command: () => { this.props.checkoutBranch(branch) }
      }, {
        name: i18n.get('git.branchWidget.checkoutAsNew'),
        command: () => dispatchCommand('git:checkout_new_branch', {
          fromBranch: branch
        })
      }, {
        name: i18n.get('git.branchWidget.delete'),
        command: () => { this.props.gitDeleteBranch(branch) }
      }]
    }))

    const remoteBranchItems = remoteBranches.map(remoteBranch => {
      const localBranch = remoteBranch.split('/').slice(1).join('/')
      return {
        name: remoteBranch,
        icon: 'fa',
        items: [{
          name: i18n.get('git.branchWidget.checkout'),
          // @todo: should prompt to input local branch name
          command: () => dispatchCommand('git:checkout_new_branch', {
            fromBranch: remoteBranch,
            toBranch: localBranch
          })
        }, {
          name: i18n.get('git.branchWidget.delete'),
          command: () => { this.props.gitDeleteBranch(remoteBranch) }
        }]
      }
    })
    return [
      { name: i18n.get('git.branchWidget.newBranch'), command: () => dispatchCommand('git:new_branch'),
        iconElement: (<span style={{ marginRight: '0.3em' }}>+</span>) },
      { name: i18n.get('git.branchWidget.synchronize'), command: () => this.props.getFetch(),
      icon: 'fa' },
      { isDivider: true },
      { name: i18n.get('git.branchWidget.localBranches'), isDisabled: true },
      ...localBranchItems,
      { isDivider: true },
      { name: i18n.get('git.branchWidget.remoteBranches'), isDisabled: true },
      ...remoteBranchItems
    ]
  }
}
