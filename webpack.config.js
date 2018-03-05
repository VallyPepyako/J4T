const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './src/'),
  entry: {
    app: './js/app.js'
  },
  output: {
    path: path.resolve(__dirname, './app/assets/js'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
    ],
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src/'),
        loader: 'babel-loader',
        // Options to configure babel with
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
};
