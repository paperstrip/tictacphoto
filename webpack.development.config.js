const webpack = require('webpack')
const path = require('path');
const autoprefixer = require('autoprefixer');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Suppression des variables inutilisées (globalPath, glob, resolve)

var config = {
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
      // --- MODIFIÉ --- Simplification du loader, plus besoin de forcer le outputPath
      {
        test: /\.(glb|gltf|bin)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/model',
              name: '[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/, // Gardé le support pour JSX
        exclude: /node_modules/,
      },
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
          'postcss-loader',
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
      // --- MODIFIÉ --- Simplification des loaders d'assets
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts/',
              publicPath: '../assets/fonts/' // Gardé pour correspondre à la structure de prod
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
              outputPath: 'assets/images/',
              publicPath: '../assets/images/' // Gardé pour correspondre à la structure de prod
            }
          },
        ]
      }
    ]
  },
};

var mainConf = Object.assign({}, config, {
  mode: "development",
  name: "mainConf",
  context: path.resolve(__dirname), // Ajout du context pour la cohérence

  // --- MODIFIÉ --- Ajout de '.scss' pour correspondre à la prod
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss'], 
    alias: {
      '@js': path.resolve(__dirname, 'js'),
      '@css': path.resolve(__dirname, 'assets/stylesheets/modules')
    }
  },
  
  devtool: 'eval-source-map', // Un devtool plus adapté au développement
  stats: {
    colors: true
  },
  entry: {
    app: ['./js/app.js', './assets/stylesheets/main.scss'],
  },

  // --- MODIFIÉ --- Bloc de sortie harmonisé avec la production
  output: {
    filename: '[name].min.js', // Suppression de .min en dev
    path: path.resolve(__dirname, '../dist'), // Chemin de sortie cohérent
    publicPath: '/assets/', // Chemin public cohérent
    chunkFilename: 'chunks-min/[name].js' // Nom de chunk cohérent
  },

  devServer: {
    compress: true,
    hot: false,
    port: 3000,
    liveReload: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
    headers: { 'Access-Control-Allow-Origin': '*' },
    static: {
      directory: path.resolve(__dirname, '../dist'),
      watch: true
    },
    proxy: {
      '*': {
        target: `http://localhost/`,
      },
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    
    // --- MODIFIÉ --- Plugin activé pour la cohérence
    new webpack.ProvidePlugin({
      $: require.resolve('jquery'),
      jQuery: require.resolve('jquery')
    }),

    new MiniCssExtractPlugin({
      filename: 'main.min.css', // Suppression de .min en dev
      chunkFilename: 'chunks-min-css/[name].css'
    }),
    
    // --- MODIFIÉ --- Chemin de destination simplifié
    new CopyWebpackPlugin({
      patterns: [
        { from: './assets/images', to: './assets/images/' },
      ]
    }),
  ],
});

module.exports = [
  mainConf
];