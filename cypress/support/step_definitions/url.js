import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Given('I visit the {string}', (urlTemplate) => {
  const url = nunjucks.renderString(urlTemplate, cy.context);

  cy.visit(url);
});

Given('I reload to {string}', (urlTemplate) => {
  const url = nunjucks.renderString(urlTemplate, cy.context);

  cy.visit(url).then(() => cy.reload(true));
});

Given('I wait until the application is loaded', () => {
  cy.url({ timeout: 30000 }).should('not.match', /\/splash/);
});

Then('I expect current url is {string}', (expectedUrlTemplate) => {
  const expectedUrl = nunjucks.renderString(expectedUrlTemplate, cy.context);

  cy.url().should('match', new RegExp(expectedUrl));
});
