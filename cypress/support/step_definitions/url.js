import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Given('I visit the {string}', (url) => {
  cy.visit(url);
});

Then('I expect current url is {string}', (expectedUrlTemplate) => {
  const expectedUrl = nunjucks.renderString(expectedUrlTemplate, cy.context);
  cy.url().should('match', new RegExp(expectedUrl));
});
