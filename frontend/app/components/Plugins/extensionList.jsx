import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { mountPackage, updatePackageList, fetchPackage } from './actions'
import store from './store'


function handleRequired (card) {
  const storeCard = store.list.find(e => e.name === card.name)
  if (card.enabled) {
    mountPackage(card.name, true)
    storeCard.enabled = false
  } else {
    fetchPackage(card).then(({ id }) => mountPackage(id))
    storeCard.enabled = true
  }
}


const Card = observer(({ card }) => (
  <div className='card'>
    <div className='title'>
      {card.name}
      <span>{card.version}</span>
    </div>
    <div className='desc'>
      {card.description}
    </div>
    <div className='author'>
      <div className='icon' />
      <div className='text'>
        {card.author}
      </div>
    </div>
    <div className='buttons'>
      <div className='label'>
        {/* <button>settings</button>*/}
        {/* <button>uninstall</button>*/}
        {card.requirement !== 'Required' ? (
          <button
            onClick={() => handleRequired(card)}
          >
            {card.enabled
              ? 'disable'
              : 'enable'}
          </button>
          ) : null}
      </div>
    </div>
  </div>))

Card.propTypes = {
  card: PropTypes.object,
}

class ExtensionList extends Component {
  state = {
    searchKey: ''
  }
  componentWillMount () {
    updatePackageList()
  }
  render () {
    const data = store.list
    return (
      <div className='settings-extension-container'>
        <div>
          <input
            type='text'
            className='search form-control'
            value={this.state.searchKey}
            placeholder={i18n.get('settings.extension.searchPlaceholder')}
            onChange={(e) => {
              this.setState({ searchKey: e.target.value })
            }}
          />
        </div>
        <div className='lists'>
          {data
              .filter((card) => {
                if (this.state.searchKey) {
                  if (card.name.includes(this.state.searchKey)) {
                    return true
                  }
                  return false
                }
                return true
              })
              .sort(card => card.requirement === 'Required')
              .map((card, idx) => (<Card key={idx} card={card} />))
          }
        </div>
      </div>
    )
  }
}

export default observer(ExtensionList)
