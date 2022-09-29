import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  cy.context = {};
});

Given('I clear cache', () => {
  localStorage.clear();
});

Then('I extract {string} from url in field {string} of context', (pattern, key) => {
  cy.url().then((url) => {
    [cy.context[key]] = new RegExp(pattern).exec(url);
  });
});

Then('I expect context field {string} is {string}', (key, expectedValue) => {
  expect(cy.context[key]).to.eq(expectedValue);
});

Then('I set localstorage field {string} to context field {string}', (localStorageField, contextField) => {
  cy.context[contextField] = localStorage.getItem(localStorageField);
});

Then('I set localstorage field {string} to context field {string}', (localStorageField, contextField) => {
  cy.context[contextField] = localStorage.getItem(localStorageField);
});

Then('I set localstorage field {string} to context field {string} as {string}', (localStorageField, contextField, type) => {
  if (type === 'json') {
    cy.context[contextField] = JSON.parse(localStorage.getItem(localStorageField));
  } else if (type === 'string') {
    cy.context[contextField] = localStorage.getItem(localStorageField);
  } else {
    throw new Error('Unknown type');
  }
});
