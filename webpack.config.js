const webpack = require('webpack');
const path = require('path');
const argv = require('yargs').argv;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = argv.mode === 'development';
const isProd = !isDev;
const distPath = path.join(__dirname, '/dist');

const config = {
  entry: {
    main: './src/js/scripts.js'
  },
  output: {
    filename: 'bundle.js',
    path: distPath
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.(sa|sc|c)ss$/,
      use: [
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              isProd ? require('cssnano') : () => {},
              require('autoprefixer')({
                browsers: ['last 2 versions']
              })
            ]
          }
        },
        'sass-loader'
      ]
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      }, {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 70
          }
        }
      },
      ],
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
    }]
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : 'none',
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  optimization: isProd ? {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false,
            drop_console: true
          },
        },
      }),
    ],
  } : {},
  devServer: {
    contentBase: distPath,
    port: 8080,
    compress: true
  }
};

module.exports = config;