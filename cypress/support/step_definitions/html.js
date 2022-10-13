import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Then('I expect {string} exists', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('be.visible');
});

Then('I expect {string} not exists', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector, { timeout: 60000 }).should('not.exist');
});

Then('I expect {string} is {string}', (templateSelector, templateExpectedValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);
  cy.get(selector).contains(expectedValue);
});

Then('I expect checkbox {string} is checked', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).invoke('attr', 'aria-checked').should('eq', 'true');
});

Then('I expect checkbox {string} is not checked', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).invoke('attr', 'aria-checked').should('eq', 'false');
});

Then('I expect field {string} is {string}', (templateSelector, templateExpectedValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);
  cy.get(selector).should('have.value', expectedValue);
});

Given('I set viewport size to {string} px for width and {string} px for height', (width, height) => {
  cy.viewport(parseInt(width, 10), parseInt(height, 10));
});

Then('I set on {string} text {string}', (templateSelector, templateValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const value = nunjucks.renderString(templateValue, cy.context);

  cy.get(selector).type(value);
});

Then('I expect {string} is closed', (selector) => {
  cy.get(selector, { timeout: 60000 }).should('not.exist');
});

Then('I expect {string} toast to appear with text {string}', (type, templateExpectedValue) => {
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);

  cy.get('.q-notification', { timeout: 60000 })
    .should('exist')
    .and('have.class', `bg-${type}`)
    .within(() => {
      cy.get('.q-notification__message.col')
        .should('have.text', expectedValue);
    });
});

Then('I expect {string} appear {int} time(s) on screen', (templateSelector, count) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('have.length', count);
});

Then('I wait {int} second(s)', (time) => cy.wait(time * 1000));
