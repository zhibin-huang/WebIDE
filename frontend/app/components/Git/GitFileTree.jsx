import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { dispatchCommand } from '../../commands'
import { connect } from 'react-redux'
import cx from 'classnames'
import _ from 'lodash'

import * as GitActions from './actions'

class GitFileTree extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTreeView: true,
      showShrinkPathView: true,
      displayOnly: this.props.displayOnly || false,
      hideTitle: this.props.hideTitle || false,
    }
  }

  render () {
    return (
      <div className='git-filetree-container' tabIndex={1}>
        <GitFileTreeNode path='/'
          visualParentPath='/'
          statusFiles={this.props.statusFiles}
          showTreeView={this.state.showTreeView}
          showShrinkPathView={this.state.showShrinkPathView}
          displayOnly={this.state.displayOnly}
          handleClick={this.props.handleClick}
          hideTitle={this.state.hideTitle} />
      </div>
    )
  }
}


class _GitFileTreeNode extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      node,
      statusFiles,
      displayOnly,
      showTreeView,
      showShrinkPathView,
      visualParentPath,    // for usage in shrinkPathView
      handleClick,
      hideTitle,
      ...actionProps} = this.props
    const {toggleNodeFold, selectNode, toggleStaging} = actionProps

    const childrenStagingStatus = this.getChildrenStagingStatus()
    const FILETREE_INDENT = 14
    let indentCompensation = this.getIndentCompensation()
    return (
      <div className='filetree-node-container'>
        { node.isRoot ?
          (<div className='filetree-node' ref={r => this.nodeDOM = r} >
            { displayOnly ? null
            : <span className='filetree-node-checkbox'
                style={{marginRight: 0}}
                onClick={e => toggleStaging(node)} >
                <i className={cx('fa', {
                  'fa-check-square': (!node.isDir && node.isStaged) || childrenStagingStatus === 'ALL',
                  'fa-square-o': (!node.isDir && !node.isStaged) || childrenStagingStatus === 'NONE',
                  'fa-minus-square': childrenStagingStatus === 'SOME',
                })}></i>
              </span>
            }
            { hideTitle ? ''
              : <span className='filetree-node-label'>{i18n`git.fileTree.fileStatus`}
                { displayOnly ? <span> ({node.leafNodes.length} {i18n`git.fileTree.changed`}) </span>
                : <span> ({this.getStagedLeafNodes().length} {i18n`git.fileTree.staged`} / {node.leafNodes.length} {i18n`git.fileTree.changed`}) </span>
                }
              </span>
            }
          </div>
          )

        : !showTreeView && node.isDir ? null // flatView

        : showShrinkPathView && this.shouldHideAtShrinkPath() ? null

        : (<div className={cx('filetree-node', {'focus':node.isFocused})}
            ref={r => this.nodeDOM = r}
            onClick={e => selectNode(node)} >
            { displayOnly ? null
            : <span className='filetree-node-checkbox'
                onClick={e => toggleStaging(node)} >
                <i className={cx('fa', {
                  'fa-check-square': (!node.isDir && node.isStaged) || childrenStagingStatus === 'ALL',
                  'fa-square-o': (!node.isDir && !node.isStaged) || childrenStagingStatus === 'NONE',
                  'fa-minus-square': childrenStagingStatus === 'SOME',
                })}></i>
              </span>
            }
            <span className='filetree-node-arrow'
              onClick={e => toggleNodeFold(node, null, e.altKey)}
              style={{
                'marginLeft': !showTreeView ? '0' : `${(node.depth - 1 - indentCompensation)*FILETREE_INDENT}px`
              }} >
              <i className={cx({
                'fa fa-angle-right': node.isFolded,
                'fa fa-angle-down': !node.isFolded,
                'hidden': !node.isDir || node.childrenCount === 0
              })}></i>
            </span>
            <span className='filetree-node-icon'>
              <i className={cx('fa file-status-indicator', node.status.toLowerCase(), {
                'fa-folder-o': node.isDir,
                'fa-pencil-square': node.status == 'MODIFIED' || node.status == 'CHANGED' || node.status == 'MODIFY',
                'fa-plus-square': node.status == 'UNTRACKED' || node.status == 'ADD',
                'fa-minus-square': node.status == 'MISSING',
                'fa-exclamation-circle': node.status == 'CONFLICTION'
              })}></i>
            </span>
            <span className='filetree-node-label'>
              { showTreeView ?
                (node.isDir && showShrinkPathView ?
                  node.path.replace(visualParentPath, '').replace(/^\//, '')
                : (handleClick ?
                    <label onClick={handleClick.bind(null, node.path)}>{node.name}</label>
                  : node.name)
                )
              : node.path}
            </span>
            <div className='filetree-node-bg'></div>
          </div>)

        }

        { node.isDir ?
          <div className={cx('filetree-node-children', {isFolded: node.isFolded})}>
            {node.children.sort((a, b) => {
              const nodeA = statusFiles.get(a)
              const nodeB = statusFiles.get(b)
              if (nodeB.isDir && !nodeA.isDir) {
                return 1
              } else if (nodeA.isDir && !nodeB.isDir) {
                return -1
              }
              return 0
            }).map(childNodePath =>
              <GitFileTreeNode
                statusFiles={statusFiles}
                key={childNodePath}
                path={childNodePath}
                showTreeView={showTreeView}
                showShrinkPathView={showShrinkPathView}
                visualParentPath={showShrinkPathView && this.shouldHideAtShrinkPath() ? visualParentPath : node.path}
                indentCompensation={indentCompensation}
                displayOnly={displayOnly}
                handleClick={handleClick} />
            )}
          </div>
        : null }
      </div>
    )
  }


  componentDidUpdate () {
    if (this.props.node.isFocused) {
      this.nodeDOM.scrollIntoViewIfNeeded && this.nodeDOM.scrollIntoViewIfNeeded()
    }
  }

  getStagedLeafNodes () {
    const {node, statusFiles} = this.props
    if (!node.isDir) return []
    return node.leafNodes.filter(leafNodePath =>
      statusFiles.get(leafNodePath).get('isStaged')
    )
  }

  getChildrenStagingStatus () {
    const {node, statusFiles} = this.props
    if (!node.isDir) return false
    let stagedLeafNodes = this.getStagedLeafNodes()
    if (stagedLeafNodes.length == 0) {
      return 'NONE'
    } else if (stagedLeafNodes.length === node.leafNodes.length) {
      return 'ALL'
    } else {
      return 'SOME'
    }
  }

  shouldHideAtShrinkPath () {
    const {node, statusFiles} = this.props
    if (!node.isDir) return false
    if (node.children.length !== 1) return false

    let childNode = statusFiles.get(node.children[0])
    if (!childNode.isDir) return false
    return true
  }

  getIndentCompensation () {
    let {node, visualParentPath, indentCompensation, showShrinkPathView} = this.props
    // if not showShrinkPathView, indentCompensation is uneccssary, set to 0
    if (!showShrinkPathView) return 0

    // else, let's do some math:
    if (!indentCompensation) indentCompensation = 0
    let indentOffset
    if (node.isRoot) {
      indentOffset = 1
    } else {
      indentOffset = (node.path.split('/').length - visualParentPath.split('/').length) || 1
    }
    if (indentOffset > 1) {
      return indentOffset - 1
    }
    return indentCompensation + indentOffset - 1
  }

}
const GitFileTreeNode = connect(
  (state, ownProps) => ({
    // statusFiles: state.GitState.statusFiles,
    statusFiles: ownProps.statusFiles,
    node: ownProps.statusFiles.get(ownProps.path),
    handleClick: ownProps.handleClick,
    displayOnly: ownProps.displayOnly,
    hideTitle: ownProps.hideTitle
  }),
  dispatch => bindActionCreators(GitActions, dispatch)
)(_GitFileTreeNode)

export default GitFileTree
