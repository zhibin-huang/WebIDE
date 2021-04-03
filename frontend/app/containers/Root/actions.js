// import { createAction } from 'redux-actions'
import config from '../../config'
import ide from '../../IDE'
import { qs } from 'utils'

// initAppState
export const INIT_STATE = 'INIT_STATE'
export const initState = () => (dispatch) => {
  const { spaceKey } = qs.parse(window.location.hash.slice(1))
  if (spaceKey) config.spaceKey = spaceKey
  window.ide = ide
  // dispatch({ type: INIT_STATE })
}
