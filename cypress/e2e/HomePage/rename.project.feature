Feature: Test home page: project rename

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectTest'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is 'projectTest/models'

  Scenario: Rename existing project should update the project name in the projects list
    # Check project is displayed in home page
    When I visit the '/'
    Then I expect '[data-cy="project-card_projectTest"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_projectTest"] [data-cy="title-container"]' is 'projectTest'

    # Rename project and check project name is updated
    When I click on '[data-cy="project-card_projectTest"] [data-cy="rename-button"]'
    And  I set on '[data-cy="rename-project-form"] [data-cy="name-input"]' text 'renamedProject'
    And  I click on '[data-cy="rename-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been renamed 😉'
    And  I expect '[data-cy="project-card_renamedProject"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_renamedProject"] [data-cy="title-container"]' is 'renamedProject'
    But  I expect '[data-cy="project-card_projectTest"]' not exists

  Scenario: Rename existing project should update the project name in the left drawer
    # Check project is displayed in left drawer
    When I visit the '/'
    Then I expect '[data-cy="home-drawer"] [data-cy="project-expansion-item"]' appear 1 time on screen

    When I click on '[data-cy="home-drawer"] [data-cy="project-expansion-item"]'
    Then I expect '[data-cy="project-expansion-item"] [data-cy="item_projectTest"]' exists
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_projectTest"]' is 'projectTest'

    # Rename project and check project name is updated
    When I click on '[data-cy="project-card_projectTest"] [data-cy="rename-button"]'
    And  I set on '[data-cy="rename-project-form"] [data-cy="name-input"]' text 'renamedProject'
    And  I click on '[data-cy="rename-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been renamed 😉'
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_renamedProject"]' appear 1 time on screen
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_renamedProject"]' is 'renamedProject'
    But  I expect '[data-cy="project-expansion-item"] [data-cy="item_projectTest"]' not exists
