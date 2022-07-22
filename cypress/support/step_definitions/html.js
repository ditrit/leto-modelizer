import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I expect {string} exists', (selector) => {
  cy.get(selector).should('be.visible');
});
