import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I set in localstorage field {string} with {string}', (key, value) => {
  localStorage.setItem(key, value);
});

Given('I set in localstorage field {string} with {string} as {string}', (key, value, type) => {
  if (type === 'json') {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
});

Given('I clear localstorage', () => {
  localStorage.clear();
});

Then('I expect localstorage field {string} is {string}', (key, expectedValue) => {
  expect(localStorage.getItem(key)).to.eq(expectedValue);
});

Then('I delete {string} in localstorage', (key) => {
  localStorage.removeItem(key);
});
