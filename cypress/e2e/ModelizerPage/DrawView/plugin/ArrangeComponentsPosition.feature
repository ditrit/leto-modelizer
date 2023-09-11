Feature: Test modelizer draw view: rearrange components automatically
  Scenario: Click on the "rearrange" icon button should reorganize components
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

    # Add 3 components
    When I click on '[data-cy="component-definition_server"]'
    And I click on '[data-cy="component-definition_server"]'
    And I click on '[data-cy="component-definition_server"]'
    And  I wait 1 second
    Then I expect '[data-cy="draw-container"] [id^="server"]' exists
    And  I expect '[data-cy="draw-container"] [id^="server"]' appear 3 time on screen

    # Check their positions before rearranging
    And I expect component "#server_1" to be at position 30,30
    And I expect component "#server_2" to be at position 170,30
    And I expect component "#server_3" to be at position 310,30

    # Rearrange
    When I click on '[data-cy="rearrange-button"]'

    # Check their positions after rearranging
    Then I expect component "#server_1" to be at position 12,12
    And I expect component "#server_2" to be at position 12,142
    And I expect component "#server_3" to be at position 12,272
