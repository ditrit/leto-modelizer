import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Scenario: visiting the frontpage
//   When I visit duckduckgo.com
//   Then I should see a search bar

// When("I visit duckduckgo.com", () => {
//   cy.visit("https://www.duckduckgo.com");
// });
//
// Then("I should see a search bar", () => {
//   cy.get("input").should(
//     "have.attr",
//     "placeholder",
//     "Search the web without being tracked",
//   );
// });

Given('I visit the {string}', (url) => {
    cy.visit(url);
});

When('I click on {string}', (selector) => {
    cy.get(selector).click();
});

Then('I expect current url is {string}', (expectedUrl) => {
    cy.url().should('include', expectedUrl);
});

Then('I expect localstorage field {string} is {string}', (key, expectedValue) => {
    expect(localStorage.getItem(key)).to.eq(expectedValue);
});
