Feature: Test modelizer draw view: template filter

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
    And  I expect '[data-cy="component-definitions-item_Templates"]' exists

  Scenario Outline: Set text as '<filter>' should display only one element inside template title
    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definitions-item_Templates"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates (1)'

    Examples:
      | filter           |
      | Aws provider     |
      | Test application |

  Scenario Outline: Set text as '<filter>' should not display template
    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definitions-item_Templates"]' appear 0 time on screen
    But  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    Examples:
      | filter    |
      | bad       |
      | amiserver |

  Scenario Outline: Select template and set text as '<filter>' should display only one element
    # Select 'Templates' library
    When I click on '[data-cy="component-definitions-item_Templates"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"].selected [data-cy="title"]' is 'Templates (1)'
    And  I expect '[data-cy="component-definition_<filter>"]' exists

    Examples:
      | filter           |
      | Aws provider     |
      | Test application |

  Scenario Outline: Select template and set text as '<filter>' should not display any elements.
    # Select 'Templates' library
    When I click on '[data-cy="component-definitions-item_Templates"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 0 time on screen
    And  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    Examples:
      | filter    |
      | bad       |
      | amiserver |

  Scenario Outline: Set text as '<filter>' then select templates library should display only one element
    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definitions-item_Templates"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates (1)'

    # Select 'Templates' library
    When I click on '[data-cy="component-definitions-item_Templates"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definitions-item_Templates"].selected [data-cy="title"]' is 'Templates (1)'
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definition_<filter>"]' exists

    Examples:
      | filter           |
      | Aws provider     |
      | Test application |
