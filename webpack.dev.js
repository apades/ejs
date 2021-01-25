const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const webpack = require('webpack')

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    path.join(__dirname, './app.ejs'),
    path.join(__dirname, './main.ts'),
  ],
  target: 'web',
  mode: 'development',
  cache: {
    type: 'memory',
  },
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'app.js',
    path: path.join(__dirname, './dist'),
    publicPath: '/',
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
            },
          },
        ],
      },
      {
        test: /\.less$/i,
        use: [
          ' ',
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
          'less-loader',
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
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    port: 9000,
    hot: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  context: path.resolve(__dirname),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.build_lang': `"${process.env.build_lang}"`,
    }),
    new HTMLWebpackPlugin({
      template: path.join(__dirname, './app.ejs'),
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [{ from: './assets', to: './assets' }],
    }),
  ],
}
