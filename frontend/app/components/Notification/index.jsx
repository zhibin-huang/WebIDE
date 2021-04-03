import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { NotificationStack } from 'react-notification'
import * as actions from './actions'
import state from './state'

const barStyleFactory = (index, style) => {
  return Object.assign({}, style, {
    left: 'initial',
    right: '-100%',
    bottom: 'initial',
    top: `${2 + index * 4}rem`,
    fontSize: '12px',
    padding: '8px',
  })
}

const activeBarStyleFactory = (index, style) => {
  return Object.assign({}, style, {
    left: 'initial',
    right: '1rem',
    bottom: 'initial',
    top: `${2 + index * 4}rem`,
    fontSize: '12px',
    padding: '8px',
  })
}

class Notification extends Component {
  constructor (props) {
    super()
  }
  render () {
    const { notifications } = this.props
    return (
      <NotificationStack
        notifications={notifications}
        onDismiss={notification => actions.removeNotification(notification.key)}
        barStyleFactory={barStyleFactory}
        activeBarStyleFactory={activeBarStyleFactory}
      />
    )
  }
}

export default inject(() => {
  const notifications = state.notifications.toJS()
  return { notifications }
})(Notification)

export { actions, state }
