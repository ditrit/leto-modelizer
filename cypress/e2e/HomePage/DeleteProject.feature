Feature: Test home page: project deletion

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect current url is 'projectName/models'

    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

  #Scenario: Delete project should remove it from the projects list
  #  Then I expect '[data-cy="project-card_projectName"]' exists
  #  And  I expect '[data-cy="project-grid-empty"]' not exists

  #  When I click on '[data-cy="project-card_projectName"] [data-cy="delete-button"]'
  #  And  I click on '[data-cy="delete-project-form"] [data-cy="confirm-delete-checkbox"]'
  #  And  I click on '[data-cy="delete-project-form"] [data-cy="submit-button"]'
  #  Then I expect 'positive' toast to appear with text 'Project has been deleted 😥'
  #  And  I expect '[data-cy="delete-project-form"]' is closed
  #  And  I expect '[data-cy="project-card_projectName"]' not exists
  #  And  I expect '[data-cy="project-grid-empty"]' is 'No projects, please create a new project to have one here 😉'

  #Scenario: Delete project should remove it from the left drawer
  #  Then I expect '[data-cy="home-drawer"] [data-cy="project-expansion-item"]' exists
  #  And  I expect '[data-cy="project-expansion-item"] [data-cy="item_projectName"]' exists
  #  And  I expect '[data-cy="project-expansion-item"] [data-cy="item_projectName"]' is 'projectName'

  #  When I click on '[data-cy="project-card_projectName"] [data-cy="delete-button"]'
  #  And  I click on '[data-cy="delete-project-form"] [data-cy="confirm-delete-checkbox"]'
  #  And  I click on '[data-cy="delete-project-form"] [data-cy="submit-button"]'
  #  Then I expect 'positive' toast to appear with text 'Project has been deleted 😥'
  #  And  I expect '[data-cy="delete-project-form"]' is closed
  #  And  I expect '[data-cy="project-expansion-item"] [data-cy="item_projectName"]' not exists
  #  And  I expect '[data-cy="project-expansion-item"] [data-cy="item-empty"]' exists
  #  And  I expect '[data-cy="project-expansion-item"] [data-cy="item-empty"]' is 'Nothing to display'
