const webpack = require('webpack')
const path = require('path');
const autoprefixer = require('autoprefixer');
const globalPath = "../dist/";



const CopyWebpackPlugin = require('copy-webpack-plugin');
// include the js minification plugin

// include the css extraction and minification plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


var config = {
  // TODO: Add common Configuration
  module: {
    rules: [

      {
        test: /\.(frag|vert|glsl)$/,
        use: [
          {
            loader: 'glsl-shader-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(glb|gltf)$/,
        use:
          [
            {
              loader: 'file-loader',
              options:
              {
                outputPath: '../dist/assets/model'
              }
            }
          ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,

      },
      // compile all .scss files to plain old css
      {
        test: /\.(scss|css|sass)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          {
            loader: "postcss-loader",

          },
          {
            loader: "sass-loader",
            options: {
              additionalData: '@import "common/_mixin";@import "common/_responsive";@import "common/_fonts";@import "common/_variables";',
              sassOptions: {
                includePaths: ['assets/stylesheets']
              }
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '../assets/fonts/'
            }
          },
        ]
      },
      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '../assets/images/'
            }
          },
        ]
      }
    ]
  },

};

var mainConf = Object.assign({}, config, {
  context: path.resolve(__dirname),

  resolve: {
    extensions: ['.js', '.json', '.scss'],
    alias: {
      '@js': path.resolve(__dirname, 'js'),
      '@css': path.resolve(__dirname, 'assets/stylesheets/modules')

    }
  },

  mode: "production",
  name: "mainConf",
  entry: {
    app: ['./js/app.js', './assets/stylesheets/main.scss'],

  },
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
    // MODIFICATION ICI : Le dossier de sortie est maintenant un parent au-dessus
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/assets/',
    chunkFilename: 'chunks-min/[name].js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      $: require.resolve('jquery'),
      jQuery: require.resolve('jquery')
    }),

    new MiniCssExtractPlugin({
      filename: 'main.min.css',
      chunkFilename: 'chunks-css-min/[name].css'

    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: './assets/images', to: './assets/images/' },
      ]

    }),
    /*new BundleAnalyzerPlugin({
      analyzerPort: 3001,
    }),*/
  ]
});

module.exports = [
  mainConf


];

