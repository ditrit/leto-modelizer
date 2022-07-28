import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I click on {string}', (selector) => cy.get(selector).click());
