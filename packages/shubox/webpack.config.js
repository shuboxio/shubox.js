const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    shubox: './index.js'
  },

  output: {
    path: path.resolve('./dist'),
    filename: '[name].umd.js',
    library: 'Shubox',
    libraryTarget: 'umd'
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: (() => {
        const {version} = require('../../lerna.json')
        const year = new Date().getFullYear()
        return `/*
Shubox ${version}
Copyright © ${year} Jayroh, LLC
 */`
      })(),
      raw: true
    })
  ]
}
