import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Given('I set in localstorage field {string} with {string}', (key, value) => {
  localStorage.setItem(key, value);
});

Given('I set in localstorage field {string} with {string} as {string}', (key, value, type) => {
  if (type === 'json') {
    // roundtrip the JSON string to validate its syntax
    localStorage.setItem(key, JSON.stringify(JSON.parse(value)));
  } else {
    localStorage.setItem(key, value);
  }
});

Given('I clear localstorage', () => {
  localStorage.clear();
});

Then('I expect localstorage field {string} is {string}', (key, templateExpectedValue) => {
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);
  expect(localStorage.getItem(key)).to.eq(expectedValue);
});

Then('I delete {string} in localstorage', (key) => {
  localStorage.removeItem(key);
});
