import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import composeReducers  from './utils/composeReducers'
import { emitterMiddleware } from 'utils/actions'
import thunkMiddleware from 'redux-thunk'

import GitReducer from './components/Git/reducer'
import localStoreCache from './localStoreCache'

const combinedReducers = combineReducers({
  GitState: GitReducer,
})

const finalReducer = composeReducers(
  localStoreCache.afterReducer,
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


export default store
export const getState = store.getState
export const dispatch = store.dispatch
