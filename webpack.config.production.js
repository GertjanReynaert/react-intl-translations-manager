var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');

var config = Object.create(baseConfig);

config.devtool = 'cheap-source-map';

config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
  },
}));

config.output = {
  path: './dist',
  filename: 'react-intl-translations-manager.min.js',
},

module.exports = config;
