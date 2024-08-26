const { ProvidePlugin } = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/resources/index.js',
  output: {
    path: resolve(__dirname, 'build'),
  },
  resolve: {
    alias: {
      fabric: resolve(__dirname, 'fabric.min.js'),
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: { presets: ['@babel/preset-react', '@babel/preset-env'] },
      },
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
      },
    ],
  },
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      React: 'react',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      meta: {
        viewport: 'initial-scale=1, maximum-scale=1',
      },
      inlineSource: '.(js|css)$',
    }),
    new HtmlInlineScriptPlugin(),
  ],
};
