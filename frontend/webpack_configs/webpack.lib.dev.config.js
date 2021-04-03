const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const str = JSON.stringify
const commonConfig = require('./workstation.dev.config.js')

const devServer = require('./devServer.config')
const stylesheet = require('./stylesheet.config')

const fs = require('fs')
const YAML = require('yamljs')

let getPluginsPorts = ''
const TASK_YAML = path.resolve(__dirname, '../task.yaml')

try {
  const data = fs.readFileSync(TASK_YAML, 'utf-8')
  getPluginsPorts = YAML.parse(data).apps
  .filter(task => task.name && task.name.split('-')[0] === 'plugin')
  .map(task => task.env ? task.env.PORT || 4000 : 4000)
  console.log(`find ${getPluginsPorts.length} dev ports`, getPluginsPorts.join(','))
} catch (e) {
  console.log('find task error', e && e.message)
}

const reactHotLoaderPrependEntries = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://ide.test:8060',
  'webpack/hot/only-dev-server',
]

const config = merge(
  {
    entry: {
      main: reactHotLoaderPrependEntries,
      workspaces: reactHotLoaderPrependEntries,
    }
  },
  commonConfig({ staticDir: '' }),
  /*
   * See: https://webpack.js.org/configuration/devtool/#devtool
   * devtool                       | build | rebuild | quality                       | production
   * --------------------------------------------------------------------------------------------
   * eval                          | +++   | +++     | generated code                | no
   * cheap-eval-source-map         | +     | ++      | transformed code (lines only) | no
   * cheap-source-map              | +     | o       | transformed code (lines only) | yes
   * cheap-module-eval-source-map  | o     | ++      | original source (lines only)  | no
   * cheap-module-source-map       | o     | -       | original source (lines only)  | yes
   * eval-source-map               | --    | +       | original source               | no
   * source-map                    | --    | --      | original source               | yes
   * inline-source-map             | --    | --      | original source               | no
   * hidden-source-map             | --    | --      | original source               | yes
   * nosource-source-map           | --    | --      | without source content        | yes
   *
   * + means faster, - slower and o about the same time
   */
  { devtool: 'cheap-module-eval-source-map' },
  { plugins: [
    new webpack.DefinePlugin({
      __DEV__: true,
      __RUN_MODE__: str(process.env.RUN_MODE || ''),
      __BACKEND_URL__: str(process.env.BACKEND_URL || ''),
      __WS_URL__: str(process.env.WS_URL || ''),
      __STATIC_SERVING_URL__: str(process.env.STATIC_SERVING_URL || ''),
      __PACKAGE_DEV__: process.env.PACKAGE_DEV,
      __PACKAGE_SERVER__: str(process.env.PACKAGE_SERVER || process.env.HTML_BASE_URL || ''),
      __PACKAGE_PORTS__: str(getPluginsPorts),
      __NODE_ENV__: str(process.env.NODE_ENV || ''),
    }),
  ]
  },
  devServer({ port: 8060 }),
  stylesheet()
)

module.exports = config
