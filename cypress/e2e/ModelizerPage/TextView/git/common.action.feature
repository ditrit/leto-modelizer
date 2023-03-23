Feature: Test modelizer text view: common action of git branch menu

  Background:
    Given I clear cache
    And   I visit the '/'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'modelName'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?path=terrator-plugin/modelName'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_projectName"]' exists

  Scenario: Should check the text of expand branches button
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 2 seconds
    # Create new branch test 1
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I expect '[data-cy="git-new-branch-form"]' exists
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'test1'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    And  I expect '[data-cy="git-new-branch-form"]' is closed
    # Create new branch test 2
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I expect '[data-cy="git-new-branch-form"]' exists
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'test2'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    And  I expect '[data-cy="git-new-branch-form"]' is closed
    # Create new branch test 3
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I expect '[data-cy="git-new-branch-form"]' exists
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'test3'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    And  I expect '[data-cy="git-new-branch-form"]' is closed
    # Create new branch test 4
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I expect '[data-cy="git-new-branch-form"]' exists
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'test4'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    And  I expect '[data-cy="git-new-branch-form"]' is closed
    # Create new branch test 5
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I expect '[data-cy="git-new-branch-form"]' exists
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'test5'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    And  I expect '[data-cy="git-new-branch-form"]' is closed

    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 2 seconds
    And  I scroll to 'bottom' into '[data-cy="git-branch-menu"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"] [data-cy="expand-list-text"]' is 'Show 1 more...'

    When I click on '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"] [data-cy="expand-list-text"]' is 'Show less'

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"] [data-cy="expand-list-text"]' is 'Show 1 more...'
