import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import { emitterMiddleware } from 'utils/actions';
import thunkMiddleware from 'redux-thunk';
import composeReducers from './utils/composeReducers';

import GitReducer from './components/Git/reducer';
import localStoreCache from './localStoreCache';

const combinedReducers = combineReducers({
  GitState: GitReducer,
});

const finalReducer = composeReducers(
  localStoreCache.afterReducer,
  combinedReducers,
  localStoreCache.beforeReducer,
);

const enhancer = compose(
  applyMiddleware(thunkMiddleware, emitterMiddleware),
  window.devToolsExtension ? window.devToolsExtension({
    serialize: {
      replacer: (key, value) => {
        if (key === 'editor') return {};
        if (key === 'DOMNode') return {};
        return value;
      },
    },
  }) : (f) => f,
);
// enhancer = applyMiddleware(thunkMiddleware)
const store = createStore(finalReducer, enhancer);
window.getState = store.getState;
window.dispatch = store.dispatch;

export default store;
export const { getState } = store;
export const { dispatch } = store;
