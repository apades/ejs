const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const webpack = require('webpack')
let lang = process.env.build_lang

module.exports = {
  entry: path.join(__dirname, './main.ts'),
  target: 'web',
  mode: 'production',
  cache: {
    type: 'memory',
  },
  devtool: false,
  bail: true,
  output: {
    filename: '[name]-[hash:7].js',
    path: path.join(__dirname, './dist'),
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxAsyncRequests: 30,
    },
    runtimeChunk: true,
    minimizer: [
      new TerserJSPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
          },
        },
      }),
      new CssMinimizerPlugin({
        cache: true,
        parallel: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-loader',
            options: {
              esModule: false,
              variable: 'data',
              interpolate: /<%=([\s\S]+?)%>/g,
              evaluate: /<%([\s\S]+?)%>/g,
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#0669FF',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|ogg|mp3)$/,
        use: ['url-loader'],
      },
      {
        test: /\.(svg?)(\?[a-z0-9]+)?$/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  context: path.resolve(__dirname),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.build_lang': `"${lang}"`,
    }),
    new CopyPlugin({
      patterns: [{ from: './assets', to: './assets' }],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:7].css',
      chunkFilename: '[id].[hash:7].css',
    }),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, './app.ejs'),
      filename: `index-${lang}.html`,
    }),
  ],
}
