const bootstrap = require('bootstrap-styl')

module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.woff2?\??([a-f\d]+)?(v=\d+\.\d+\.\d+)?$/,
          use: ['file-loader']
          // loader: "url?limit=10000&mimetype=application/font-woff"
        }, {
          test: /\.ttf\??([a-f\d]+)?(v=\d+\.\d+\.\d+)?$/,
          use: ['file-loader']
          // loader: "url?limit=10000&mimetype=application/octet-stream"
        }, {
          test: /\.eot\??([a-f\d]+)?(v=\d+\.\d+\.\d+)?$/,
          use: ['file-loader']
        }, {
          test: /\.svg\??([a-f\d]+)?(v=\d+\.\d+\.\d+)?$/,
          use: ['file-loader']
          // loader: "url?limit=10000&mimetype=image/svg+xml"
        }, {
          test: /\.styl$/,
          use: [
            {
              loader: 'style-loader',
              // options: {
              //   injectType: 'lazyStyleTag'
              // }
            },
            'css-loader',
            {
              loader: 'stylus-loader',
              options: {
                stylusOptions: {
                  use: [bootstrap()]
                }
              }
            }
          ]
        }, {
          test: /\.css$/,
          use: [{
            loader: 'style-loader',
            // options: {
            //   injectType: 'lazyStyleTag'
            // }
          }, 'css-loader']
        }
      ]
    },
  }
}
