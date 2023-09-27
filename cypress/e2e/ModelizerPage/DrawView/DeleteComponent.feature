Feature: Test modelizer draw view: delete component

  Scenario: Delete component should hide detail panel
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infra'
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    # Select 'terrator-plugin' library
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 35 times on screen

    # Create component
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    Then I expect '[data-cy="draw-container"] [id^="aws"]' exists

    # Open component detail panel
    When I click on '[data-cy="draw-container"] [id^="aws"]'
    And  I wait 1 second
    Then I expect '[data-cy="object-details-panel"]' exists
    And  I expect '[id^="remove-component"]' exists

    # Remove component
    When I click on '[id^="remove-component"]'
    And  I wait 1 second
    Then I expect '[data-cy="object-details-panel"]' to be hidden
    And  I expect '[data-cy="draw-container"] [id^="aws"]' not exists