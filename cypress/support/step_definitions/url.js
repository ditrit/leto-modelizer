import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Given('I visit the {string}', (url) => cy.visit(url));

Then('I expect current url matches {string}', (expectedUrlPattern) => {
  const pattern = new RegExp(expectedUrlPattern);
  return cy.url().should('match', pattern);
});

Then('I expect current url contains {string}', (templateUrl) => {
  const expectedUrl = nunjucks.renderString(templateUrl, cy.context);
  return cy.url().should('contain', expectedUrl);
});
