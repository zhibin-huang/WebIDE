import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { composeReducers } from './utils'
import { dispatch as emitterDispatch, emitterMiddleware } from 'utils/actions'
import thunkMiddleware from 'redux-thunk'

import GitReducer from './components/Git/reducer'
import RootReducer from './containers/Root/reducer'

import localStoreCache from './localStoreCache'

const combinedReducers = combineReducers({
  GitState: GitReducer,
})

const crossReducers = composeReducers(RootReducer)
const finalReducer = composeReducers(
  localStoreCache.afterReducer,
  crossReducers,
  combinedReducers,
  localStoreCache.beforeReducer
)

const enhancer = compose(
  applyMiddleware(thunkMiddleware, emitterMiddleware),
  window.devToolsExtension ? window.devToolsExtension({
    serialize: {
      replacer: (key, value) => {
        if (key === 'editor') return {}
        if (key === 'DOMNode') return {}
        return value
      }
    }
  }) : f => f
)
// enhancer = applyMiddleware(thunkMiddleware)
const store = createStore(finalReducer, enhancer)
window.getState = store.getState
window.dispatch = store.dispatch


window.addEventListener('storage', (e) => {
  if (e.key && e.key.includes('CodingPackage')) {
    store.dispatch({ type: 'UPDATE_EXTENSION_CACHE' })
  }
})

export default store
export const getState = store.getState
export const dispatch = store.dispatch
