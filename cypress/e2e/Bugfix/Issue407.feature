Feature: Fix issue #407: Click on component definition from palette causes error for plugins with single file diagrams

  Scenario: Add a component by click from the github-action plugin
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Create model
    When I click on '[data-cy="create-model-button"]'
    And  I select '[data-cy="item_githubator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'Githubator.yml'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=githubator-plugin&path=\.github/workflows/Githubator.yml'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_githubator-plugin"] [data-cy="title"]' is 'githubator-plugin'

    # Click on component
    When I click on '[data-cy="component-definitions-item_githubator-plugin"]'
    Then I expect '[data-cy="component-definition_workflow"]' exists

    When I click on '[data-cy="component-definition_workflow"]'
    Then I expect '[data-cy="draw-container"] [id^="workflow"]' exists
    And  I expect '[data-cy="draw-container"] [id^="workflow"]' appear 1 time on screen
