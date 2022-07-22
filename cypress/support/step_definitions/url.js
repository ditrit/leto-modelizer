import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit the {string}', (url) => {
  cy.visit(url);
});

Then('I expect current url is {string}', (expectedUrl) => {
  cy.url().should('match', new RegExp(expectedUrl));
});
