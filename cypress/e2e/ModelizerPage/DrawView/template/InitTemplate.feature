Feature: Test modelizer draw view: template initialization

  Background:
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'

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

  Scenario: Template should appear in component definitions list
    Then I expect '[data-cy="component-definitions-item_Templates"]' exists
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates'

  Scenario Outline: Should have only one templates library installed with all these definitions
    When I click on '[data-cy="component-definitions-item_Templates"]'
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definitions-item_Templates"].selected [data-cy="title"]' is 'Templates (2)'
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen
    And  I expect '[data-cy="component-definition_<element>"]' exists

    Examples:
      | element          |
      | Aws provider     |
      | Test application |
