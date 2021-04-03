import React, { Component } from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import Menu from '../Menu'
import {setContext} from '../../commands/dispatchCommand'

const ContextMenu = (props) => {
  const {items, context, isActive, pos, deactivate, className} = props
  if (!isActive) return null
  // add a `pos` related key to Menu can force it to re-render at change of pos

  setContext(context) // <- each time invoked, update command's context

  return (
    <div className={`context-menu ${className}`} style={{left: pos.x, top: pos.y}} >
      <Menu key={`cm-${pos.x}-${pos.y}`}
        items={items}
        deactivate={deactivate}
        context={context}
      />
    </div>
  )
}

export default ContextMenu
