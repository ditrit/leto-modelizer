import { When } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

When('I click on {string}', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).click();
});

//  TODO: to remove when another solution is found for the click
When('I force click on {string}', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).click({ force: true });
});

When('I double click on {string}', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).dblclick();
});

When('I scroll to {string} into {string}', (position, templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).scrollTo(position);
});

When('I hover {string} to make it visible', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('be.hidden').invoke('show');
});

When('I drag {string} onto {string}', (templateOriginSelector, templateDestinationSelector) => {
  const originSelector = nunjucks.renderString(templateOriginSelector, cy.context);
  const destinationSelector = nunjucks.renderString(templateDestinationSelector, cy.context);

  cy.get(originSelector).drag(destinationSelector, { force: true });
});
