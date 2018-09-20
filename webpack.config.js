/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const ASSET_PATH = process.env.AWS_S3_KEY || '/';

module.exports = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: ASSET_PATH,
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
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/static/index.html'),
      hash: true,
      inject: false,
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['css/style.css', 'data/neighb_coords.js'],
      files: 'index.html',
      append: false,
      hash: true,
    }),
  ],
};
