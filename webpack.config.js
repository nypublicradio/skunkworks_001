/* eslint-env node */
const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env'],
          plugins: [require('@babel/plugin-proposal-object-rest-spread')]        }
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      }
    ]
  }
};



