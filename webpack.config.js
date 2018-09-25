/* eslint-env node */
require('dotenv').config();

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const ROOT_PATH = process.env.AWS_S3_KEY ? `/${process.env.AWS_S3_KEY}/` : '/';
const BASE_URL = process.env.BASE_URL || '';

module.exports = {
  mode: process.env.ENV ? 'production' : 'development', // ENV is set in circle
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: `${BASE_URL}${ROOT_PATH}`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ['@babel/preset-env'],
          plugins: [require('@babel/plugin-proposal-object-rest-spread')]
        }
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      ROOT_PATH: JSON.stringify(ROOT_PATH),
      BASE_URL: JSON.stringify(BASE_URL),
      IS_SCREENSHOTTING: JSON.stringify(process.env.IS_SCREENSHOTTING),
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/static/index.html'),
      hash: true,
      inject: false,
      deploy: !!process.env.ENV, // renders index share data if deploying
      baseURL: BASE_URL,
      rootPath: ROOT_PATH,
      isScreenshotting: process.env.IS_SCREENSHOTTING,
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['css/style.css', 'data/neighb_coords.js'],
      files: 'index.html',
      append: false,
      hash: true,
    }),
  ],
};
