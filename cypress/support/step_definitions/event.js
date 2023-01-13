import { When } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

When('I click on {string}', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).click();
});

When('I double click on {string}', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).dblclick();
});

When('I click on body to close popup', () => {
  cy.get('body').click(0, 0);
});

When('I scroll to {string} into {string}', (position, templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).scrollTo(position);
});

When('I hover {string} to make it visible', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('be.hidden').invoke('show');
});
