Feature: Test homepage: open project

  Scenario: Open existing project
    Given I clear cache
    And  I visit the "/"
    And  I click on '[data-cy="new-project"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="project-name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="new-project-form-submit"]'
    And  I expect current url is "modelizer/projectName/model"

    When I click on '[data-cy="app-logo-link"]'
    Then I expect current url is "/"
    And  I expect '[data-cy="project-card-projectName"]' exists
    And  I expect '[data-cy="project-card-projectName"] [data-cy="project-card-title"]' is "projectName"

    When I click on '[data-cy="project-card-projectName"]'
    Then I expect current url is "/modelizer/projectName/model"
