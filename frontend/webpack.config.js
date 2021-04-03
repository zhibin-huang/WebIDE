/*eslint-disable*/
require('dotenv').config()
var production = ['production', 'prod', 'qprod'];

if (process.env.NODE_ENV && production.indexOf(process.env.NODE_ENV) > -1) {
  module.exports = require('./webpack_configs/webpack.prod.config.js')
} else if (process.env.NODE_ENV === 'staging') {
  module.exports = require('./webpack_configs/webpack.staging.config.js')
} else {
  module.exports = require('./webpack_configs/webpack.dev.config.js')
}

