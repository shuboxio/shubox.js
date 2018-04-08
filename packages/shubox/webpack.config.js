const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    shubox: './index.js'
  },

  output: {
    filename: '[name].umd.js',
    path: path.resolve('./dist'),
    library: 'Shubox',
    libraryTarget: 'umd'
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.BannerPlugin({
      banner: (() => {
        const { version } = require('../../lerna.json')
        const year = new Date().getFullYear()
        return `/*
Shubox ${version}
Copyright © ${year} Gray Dog Labs, LLC
 */`
      })(),
      raw: true
    })
  ]
}
