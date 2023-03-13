Feature: Test homepage: project creation

  Background:
    Given I clear cache
    And  I visit the "/"

    When I click on '[data-cy="new-project-button"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="submit-button"]'

  Scenario: Create project should redirect to project model view page
    Then I expect current url is "modelizer/projectName/models"

  Scenario: Create project should send positive notification
    Then I expect "positive" toast to appear with text "Project has been created 🥳!"

  Scenario: Create project should save it in browser cache
    Then I expect current url is "modelizer/projectName/models"
    And  I expect localstorage field "projects" is '{"projectName":{"id":"projectName"}}'
