const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

const PROJECT_ROOT = path.resolve(__dirname, '..');
require('dotenv').config();

module.exports = function (options = {}) {
  const {
    mainEntryHtmlName = 'workspace.html',
    workspacesEntryHtmlName = 'index.html',
    staticDir = 'rs',
  } = options;

  const publicPath = path.join('/', staticDir, '/'); // publicPath should end with '/'
  return {
    entry: {
      main: [path.join(PROJECT_ROOT, 'app')],
      workspaces: [path.join(PROJECT_ROOT, 'app/workspaces_standalone')],
    },
    output: {
      publicPath,
      path: path.join(PROJECT_ROOT, 'build', staticDir),
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules', path.join(PROJECT_ROOT, 'app')],
      alias: {
        static: path.join(PROJECT_ROOT, 'static'),
        vscode: require.resolve('monaco-languageclient/lib/vscode-compatibility'),
      },
      fallback: {
        net: false,
        child_process: false,
        path: require.resolve('path-browserify'),
      },
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, './loaders/'), 'node_modules'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Web IDE',
        excludeChunks: ['workspaces'],
        filename: (staticDir ? '../' : '') + mainEntryHtmlName,
        template: path.join(PROJECT_ROOT, 'app/index.html'),
      }),
      new HtmlWebpackPlugin({
        title: 'Web IDE',
        excludeChunks: ['main'],
        filename: (staticDir ? '../' : '') + workspacesEntryHtmlName,
        template: path.join(PROJECT_ROOT, 'app/workspaces_standalone/index.html'),
      }),
      // https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin({
        patterns: [{
          from: path.join(PROJECT_ROOT, 'node_modules/font-awesome'),
          to: 'font-awesome',
        }, {
          from: path.join(PROJECT_ROOT, 'node_modules/octicons'),
          to: 'octicons',
        }],
      }),
      new MonacoWebpackPlugin({
        languages: ['java'],
      }),
    ],
    module: {
      rules: [
        { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      ],
    },
  };
};
