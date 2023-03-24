Feature: Test modelizer text view: update git branch

  Background:
    Given I clear cache
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

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'modelName'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?path=terrator-plugin/modelName'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I wait 1 second

  Scenario: Update action should be available only for branch that are local and remote
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="update_main"]' exists
    And  I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'

    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]'
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="update_main"]' exists
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]'

    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote1"]'
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="update_test/remote1"]' not exists
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote1"]'

  Scenario: Execute update action with fast forward should be a success
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="update_main"]'
    Then I expect checkbox '[data-cy="git-update-form"] [data-cy="fast-forward-checkbox"]' is checked

    When I click on '[data-cy="git-update-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-update-form"]' is closed
    And I expect 'positive' toast to appear with text 'Branch is updated 🥳!'

  Scenario: Execute update action without fast forward should be a success
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="update_main"]'
    And  I click on '[data-cy="git-update-form"] [data-cy="fast-forward-checkbox"]'
    Then I expect checkbox '[data-cy="git-update-form"] [data-cy="fast-forward-checkbox"]' is not checked

    When I click on '[data-cy="git-update-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-update-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is updated 🥳!'
