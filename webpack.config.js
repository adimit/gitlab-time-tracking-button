/**
 * Global compilation configuration file for webpack
 *
 * Output is in /addon
 *
 * It produces three bundles:
 *
 * - /background.js
 * - /options.{js,html}
 *
 * It also copies the necessary HTML files and icons.
 */

const path = require("path");
const glob = require("glob");

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlTextPlugin = new ExtractTextPlugin("[name].html");

const addon = path.resolve(__dirname, "addon");
const source_path = path.resolve(__dirname, "./src");

module.exports = {
  entry: {
    /** background script */
    'background': path.resolve(source_path, "background.js"),

    /** options script and its assets, used for addon options.
        The HTML is extracted with the extract text plugin */
    'options': glob.sync(path.resolve(source_path, "options.*"))
  },
  devtool: 'source-map',
  output: {
    path: addon,
    filename: "[name].js"
  },
  plugins: [
    new CopyWebpackPlugin([
      /** Copies the icons and the manifest to the target location */
      {
        from: path.resolve(__dirname, "manifest.json"),
        to:   path.resolve(addon, "manifest.json")
      },
      {
        from: path.resolve(__dirname, "icons"),
        to:   path.resolve(addon, "icons")
      }
    ]),
    HtmlTextPlugin
  ],
  resolve: {
    /** This hack is here because sinon uses 'require' in buggy ways */
    alias: {
      sinon: path.resolve(__dirname, 'node_modules/sinon/pkg/sinon.js') // require dist version instead
    }
  },
  module: {
    /** See above comment on resolve.alias.sinon */
    noParse: [ /node_modules\/sinon$/ ],

    rules: [
      {
        /** run all js files through babel loader with es2015, except node_modules */
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['transform-runtime']
          }
        }
      },
      {
        test: /\.css$/,
        loader: "css-loader"
      },
      {
        /** SCSS files are first run through the SCSS compiler, and then processd just like CSS files */
        test: /\.scss$/,
        loader: "css-loader!sass-loader"
      },
      {
        /** The html file for options is extracted separately, as it needs
            to be present for the webextensions options mechanism to work.*/
        test: /.*(options).*\.html$/,
        loader: HtmlTextPlugin.extract({use: "raw-loader"})
      },
      {
        /** HTML files are included in the JS bundle, and not extracted. */
        test: /assets.*\.html$/,
        loader: "html-loader"
      },
      {
        /** PNGs are loaded inline in JS bundles */
        test: /.*\.png$/,
        loader: "url-loader?mimetype=image/png"
      },
      {
        /** GIFs are loaded inline in JS bundles */
        test: /.*\.gif$/,
        loader: "url-loader?mimetype=image/gif"
      }
    ]
  }
};
