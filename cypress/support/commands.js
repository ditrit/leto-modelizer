// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import '@4tw/cypress-drag-drop';
import 'cypress-real-events';

Cypress.Commands.add('drag', (dragSelector, dropSelector) => {
  const draggable = Cypress.$(dragSelector)[0];
  const originCoords = draggable.getBoundingClientRect();

  let targetCoords;

  if (typeof dropSelector === 'string') {
    const droppable = Cypress.$(dropSelector)[0];
    targetCoords = droppable.getBoundingClientRect();
    targetCoords.x -= originCoords.x;
    targetCoords.y -= originCoords.y;
  } else {
    targetCoords = dropSelector;
  }

  cy.get(dragSelector)
    .realMouseDown()
    .realMouseMove(targetCoords.x, targetCoords.y, { position: 'center' })
    .realMouseUp();
});
