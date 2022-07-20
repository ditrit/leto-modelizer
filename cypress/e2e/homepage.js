import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit the {string}', (url) => {
  cy.visit(url);
});

When('I click on {string}', (selector) => {
  cy.get(selector).click();
});

Then('I expect current url is {string}', (expectedUrl) => {
  cy.url().should('include', expectedUrl);
});

Then('I expect localstorage field {string} is {string}', (key, expectedValue) => {
  expect(localStorage.getItem(key)).to.eq(expectedValue);
});
