const { defineConfig } = require('cypress');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const browserify = require('@badeball/cypress-cucumber-preprocessor/browserify');

/**
 * Setup the node events for the cucumber preprocessor.
 * @param {object} events - Cypress.PluginEvents.
 * @param {object} configuration - Cypress.PluginConfigOptions.
 * @returns {Promise} Promise with config as it might have been
 * modified by the plugin on success otherwise an error.
 */
async function setupNodeEvents(events, configuration) {
  await preprocessor.addCucumberPreprocessorPlugin(events, configuration);

  events('file:preprocessor', browserify.default(configuration));

  // Make sure to return the config object as it might have been modified by the plugin.
  return configuration;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: '**/*.feature',
    supportFile: './cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,
    setupNodeEvents,
    experimentalRunAllSpecs: true,
  },
  retries: 3,
});
