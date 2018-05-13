const webpack = require("webpack");
const path = require('path');

module.exports = {
  entry: {
    bundle: './src/lib/index.js',
    about: './src/lib/about.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src/browser/js')
  },
  plugins: [
    
  ],
};