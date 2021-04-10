const webpack = require('webpack')
const {merge} = require('webpack-merge')
const str = JSON.stringify
const commonConfig = require('./webpack.common.config.js')
const stylesheet = require('./stylesheet.config')

module.exports = merge(
  commonConfig({
    staticDir: process.env.RUN_MODE ? 'rs2' : 'rs',
  }),
  stylesheet(),
  {
    mode: 'production',
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: false,
        __RUN_MODE__: str(process.env.RUN_MODE || ''),
        __BACKEND_URL__: str(process.env.BACKEND_URL || ''),
        __WS_URL__: str(process.env.WS_URL || ''),
        __STATIC_SERVING_URL__: str(process.env.STATIC_SERVING_URL || ''),
      }),
    ]
  }
)
