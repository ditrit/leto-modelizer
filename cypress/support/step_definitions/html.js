import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Then('I expect {string} exists', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('exist');
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

  cy.get(selector).type('{selectall}{backspace}');
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
    .last(() => {
      cy.get('.q-notification__message.col')
        .should('include.text', expectedValue);
    });
});

Then('I expect {string} appear {int} time(s) on screen', (templateSelector, count) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('have.length', count);
});

Then('I wait {int} second(s)', (time) => cy.wait(time * 1000));

Then('I expect {string} to be disabled', (selector) => {
  cy.get(selector).should('be.disabled');
});

Then('I expect {string} to be enabled', (selector) => {
  cy.get(selector).should('not.be.disabled');
});

Then('I clear active file', () => {
  cy.get('[data-cy="monaco-editor"]').click();
  cy.get('[data-cy="monaco-editor"]').focused();
  // Need both usage for clearing monaco-editor
  cy.get('[data-cy="monaco-editor"]').type('{selectall}{backspace}');
  cy.get('.monaco-editor textarea:first').type('{selectall}{backspace}');
});

Then('I set active file content to {string}', (value) => {
  cy.get('[data-cy="monaco-editor"]').click();
  cy.get('[data-cy="monaco-editor"]').focused();
  cy.get('[data-cy="monaco-editor"]').type('{selectall}{backspace}');
  cy.get('[data-cy="monaco-editor"]').type(value, {
    parseSpecialCharSequences: false,
  });
});

Then('I expect active file content to contain {string}', (value) => {
  cy.get('[data-cy="monaco-editor"]').should(($div) => {
    const text = $div.text();
    expect(text).to.match(new RegExp(value));
  });
});

Then('I expect active file content to be equal to {string}', (TemplateFilePath) => {
  const filePath = nunjucks.renderString(TemplateFilePath, cy.context);
  let fileContent;

  cy.readFile(filePath).then((file) => {
    fileContent = file.trim();

    return cy.get('[data-cy="monaco-editor"] .view-lines .view-line');
  }).then((lines) => {
    let text = '';

    for (let index = 0; index < lines.length; index += 1) {
      text += `${lines[index].textContent.replaceAll(/\s/g, ' ')}\n`;
    }

    expect(text.trim().indexOf(fileContent) >= 0).to.eq(true);
  });
});

Then('I expect active file content to not contain {string}', (value) => {
  cy.get('[data-cy="monaco-editor"]').should('not.contain', value);
});

Then('I expect {string} width is {int}', (templateSelector, width) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).should((element) => {
    expect(Math.trunc(element.width())).eq(width);
  });
});

Then('I expect {string} height is {int}', (templateSelector, height) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).should((element) => {
    expect(Math.trunc(element.height())).eq(height);
  });
});

Then('I expect {string} to be at position {int},{int}', (templateSelector, x, y) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).should((element) => {
    expect(Math.trunc(element.position().left)).eq(x);
    expect(Math.trunc(element.position().top)).eq(y);
  });
});
