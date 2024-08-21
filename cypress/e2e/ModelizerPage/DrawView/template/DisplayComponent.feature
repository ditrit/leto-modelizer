@skip
Feature: Test modelizer draw view: add template component

  Scenario Outline: Dragging the <element> component template should display it on the page
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=@ditrit/terrator-plugin&path=infra'
    And  I expect '[data-cy="component-definitions-item_Templates"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates'

    # Select 'Templates' library
    When I click on '[data-cy="component-definitions-item_Templates"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen

    # TODO: update/fix test
    And  I expect '[data-cy="draw-container"] [id^="<element>_"]' not exists

    When I drag '[data-cy="component-definition_<element>"]' onto '[data-cy="draw-container"]'
    And  I wait 1 second
    Then I expect '[data-cy="draw-container"] [id^="<element>"]' exists
    And  I expect '[data-cy="draw-container"] [id^="<element>"]' appear 1 time on screen

    Examples:
      | element          |
      | Aws provider     |
      | Test application |
