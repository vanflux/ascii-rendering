const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { DefinePlugin, ProgressPlugin } = require("webpack");

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

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
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/'
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
    new DefinePlugin({
      ENV: JSON.stringify(process.env.ENV ?? 'dev'),
      BUILD_TIME: JSON.stringify(new Date().toISOString())
    }),
    new MiniCssExtractPlugin(isProduction ? {
      filename: "[name].[contenthash:8].css",
      chunkFilename: "[name].[contenthash:8].chunk.css",
    } : {}),
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './public/index.html')
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: { ignore: ['**/index.html'] }
        },
      ],
    }),
  ].filter(Boolean)
}
