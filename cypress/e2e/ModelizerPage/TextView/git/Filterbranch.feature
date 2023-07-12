Feature: Test modelizer text view: filter git branch

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I visit the '/'

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
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I wait 1 second

  Scenario: Expect to have no branch with 'no_main' filter
    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'not_main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' not exists

  Scenario: Expect to have main branch with 'main' filter
    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'not_main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' not exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

  Scenario: Create new branch then check if filter works
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    Then I expect checkbox '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]' is checked
    And  I expect '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' exists

    When I wait 2 seconds
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]'
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'testNewBranch'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is created 🥳!'

    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-current-branch-button"]' is 'testNewBranch'
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_testNewBranch"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'not_main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_test-testNewBranch"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' not exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'no_main main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_testNewBranch"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'no_main main testNewBranch'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_testNewBranch"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists
