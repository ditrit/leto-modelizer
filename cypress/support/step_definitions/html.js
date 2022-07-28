import { Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Then('I expect {string} exists', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('be.visible');
});

Then('I expect {string} is {string}', (templateSelector, templateExpectedValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);
  cy.get(selector).contains(expectedValue);
});
