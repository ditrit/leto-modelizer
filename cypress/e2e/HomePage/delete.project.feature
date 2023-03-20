Feature: Test home page: project deletion

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'

  Scenario: Delete existing project
    # Create project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is 'modelizer/projectName/models'

    When I visit the '/'
    Then I expect '[data-cy="project-card_projectName"]' exists
    And  I expect '[data-cy="project-grid-empty"]' not exists

    # Delete project and check it no longer exists
    When I click on '[data-cy="project-card_projectName"] [data-cy="delete-button"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="confirm-delete-checkbox"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been deleted 😥'
    And  I expect '[data-cy="delete-project-form"]' is closed
    And  I expect '[data-cy="project-card_projectName"]' not exists
    And  I expect '[data-cy="project-grid-empty"]' is 'No projects, please create a new project to have one here 😉'
