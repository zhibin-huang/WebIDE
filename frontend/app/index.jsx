import { AppContainer } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'
import Root from './containers/Root'
import './styles/main.styl'
import initialize from './initialize'
import InitializeContainer from './containers/Initialize'
import SettingState from 'components/Setting/state'
import baseTheme from './styles/base-theme/index.styl'
//import darkTheme from './styles/dark/index.styl'
//const uiTheme = SettingState.settings.appearance.ui_theme.value
window.themes = { '@current': baseTheme }
// if (uiTheme === 'base-theme') {
//   console.log(baseTheme)
//   baseTheme.use()
//   window.themes = { '@current': baseTheme }
// } else {
//   console.log(darkTheme)
//   darkTheme.use()
//   window.themes = { '@current': darkTheme }
// }

const rootElement = document.getElementById('root')
render(<InitializeContainer />, rootElement)

async function startApp (module) {
  const step = await initialize()
  if (!step.allSuccess) {
    return
  }
  if (__DEV__) {
    const hotLoaderRender = () =>
      render(<AppContainer><Root /></AppContainer>, rootElement)

    hotLoaderRender()
    if (module.hot) module.hot.accept('./containers/Root', hotLoaderRender)
  } else {
    render(<Root />, rootElement)
  }
}

startApp(module)

const log = (...args) => console.log(...args) || (x => x)
if (__VERSION__) log(`[VERSION] ${__VERSION__}`)
