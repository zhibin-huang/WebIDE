const webpack = require('webpack')
const {merge} = require('webpack-merge')
const str = JSON.stringify
const commonConfig = require('./webpack.common.config.js')
const stylesheet = require('./stylesheet.config')

module.exports = merge(
  commonConfig(),
  stylesheet(),
  {
    mode: 'production',
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: false,
        __BACKEND_URL__: str(process.env.BACKEND_URL || ''),
        __STATIC_SERVING_URL__: str(process.env.STATIC_SERVING_URL || ''),
      }),
    ]
  }
)
