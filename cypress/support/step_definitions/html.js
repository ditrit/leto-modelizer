import { Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Then('I expect {string} exists', (selector) => {
  cy.get(selector).should('be.visible');
});

Then('I expect {string} is {string}', (selector, __expectedValue) => {
  const expectedValue = nunjucks.renderString(__expectedValue, cy.context);
  cy.get(selector).contains(expectedValue);
});
