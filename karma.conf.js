/**
 * Configuration files for tests
 *
 * We include an entrypoint 'karma.entry.js',
 * which takes care of loading all tests in the correct context.
 *
 * Webpack is used to create the test bundle.
 */

const path = require('path');

/**
 * We include the standard webpack.config, so we don't have to replicate it here.
 * It needs to be modified slightly.
 */
const webpackConfig = require('./webpack.config.js');

/**
 * Use inline source maps for karma
 */
webpackConfig.devtool = 'inline-source-map';

/**
 * Add a post processor for istanbul's coverage instrumenter.
 * This takes care of generating coverage that respects the source maps (i.e.
 * not for the whole bundle at once.) We also exclude node_modules and the test
 * files themselves from the coverage reports.
 */
webpackConfig.module.rules.unshift({
  enforce: 'post',
  test: /\.js$/,
  loader: 'istanbul-instrumenter-loader',
  exclude: /(node_modules|test\.js)/
});

module.exports = function(config) {
  config.set({
    /**
     * Include the entrypoint and all fixtures
     */
    files: [
      'karma.entry.js',
    ],

    preprocessors: {
      /**
       * Generate source maps for the entry point and dependent files, and
       * compile them with webpack
       */
      'karma.entry.js': ['webpack', 'sourcemap']

    },

    /**
     * Generate HTML coverage reports in coverage,
     * and a text report in the end
     */
    coverageIstanbulReporter: {
      reports: ['html', 'text'],
      fixWebpackSourcePaths: true,
      dir: path.join(__dirname, 'coverage')
    },

    reporters: ['mocha', 'coverage-istanbul'],

    mochaReporter: {
      /**
       * Mocha will report the full suite on first run, and less next time
       */
      output: 'autowatch'
    },

    webpack: webpackConfig,

    /**
     * The framework plugins allow using the functionality without using 'import'
     */
    frameworks: ['chai', 'mocha', 'sinon', 'sinon-chrome'],

    /**
     * We use ChromiumHeadless for fast testing. The tests can also be run in
     * Firefox or Chromium for debugging.
     */
    browsers: ['Chromium', 'ChromiumHeadless'],

    webpackMiddleware: {
      /**
       * Tell Webpack to be quiet
       */
      stats: 'errors-only'
    }
  });
};
