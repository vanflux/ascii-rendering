const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { ProgressPlugin } = require("webpack");

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.[jt]s?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    port: process.env.PORT ?? 3000
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
  plugins: [
    new ProgressPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/index.html')
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.', globOptions: { ignore: ['**/index.html'] } },
      ],
    }),
  ]
}
