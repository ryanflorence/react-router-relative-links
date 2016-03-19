const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'index.js'),
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'react-router-relative-links':
        path.resolve(__dirname, '..', 'modules', 'RelativeLinks.js')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: true
    }
  }
}
