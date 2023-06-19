const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3002,
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      library: { type: 'var', name: 'app2' },
      filename: 'remoteEntry.js',
      exposes: {
        './LineChart': './src/LineChart',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true }, 'd3-array': {
        exclude: function(context) {
          // When invoked by d3-scale or react-launch-line exclude from sharing
          if (context.indexOf('react-launch-line') > -1 || context.indexOf('node_modules') > -1) {
            return true;
          }
          return false;
        }
      } }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
