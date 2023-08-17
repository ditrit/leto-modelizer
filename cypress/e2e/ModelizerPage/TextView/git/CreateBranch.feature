Feature: Test modelizer text view: create git branch

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I set on '[data-cy="import-project-form"] [data-cy="username-input"]' text 'test'
    And  I set on '[data-cy="import-project-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'
    And  I expect '[data-cy="import-project-form"]' is closed

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=infra'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists

  Scenario: Create new branch action with checkout option should create a new branch and checkout on it
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    Then I expect checkbox '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]' is checked
    And  I expect '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' exists

    When I wait 2 seconds
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]'
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'test-new-branch'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is created 🥳!'
    And  I expect '[data-cy="git-current-branch-button"]' is 'test-new-branch'

  Scenario: Create new branch action without checkout option should create a new branch and not checkout on it
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    Then I expect checkbox '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]' is not checked

    When I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'test-new-branch'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is created 🥳!'
    And  I expect '[data-cy="git-current-branch-button"]' is 'main'
