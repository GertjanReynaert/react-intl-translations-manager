var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    './src/index.js',
  ],

  output: {
    path: './dist',
    filename: 'react-intl-translations-manager.js',
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
    },
    ],
  },

  node: {
    fs: 'empty',
  },
};
