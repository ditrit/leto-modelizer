import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I set in localstorage field {string} with {string}', (key, value) => {
  localStorage.setItem(key, value);
});

Then('I expect localstorage field {string} is {string}', (key, expectedValue) => {
  expect(localStorage.getItem(key)).to.eq(expectedValue);
});

Then('I delete {string} in localstorage', (key) => {
  localStorage.removeItem(key);
});
