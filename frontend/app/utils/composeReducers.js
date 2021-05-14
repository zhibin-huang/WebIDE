export default function composeReducers () {
  const reducers = [...arguments]
  if (reducers.length === 0) return arg => arg
  if (reducers.length === 1) return reducers[0]
  
  return function composedReducers (state, action) {
    return reducers.reduceRight((lastState, reducer) => reducer(lastState, action), state)
  }
}
