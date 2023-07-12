Feature: Test modelizer text view: git log display

  Scenario: Display dialog containing the list of logs
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height

    When I visit the '/'
    And  I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infra'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    And  I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-log-item"]' exists

    When I wait 1 second
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' appear 1 time on screen
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' is 'Initial commit.'
