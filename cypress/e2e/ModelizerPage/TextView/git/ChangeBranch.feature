Feature: Test modelizer text view: change git branch

  Scenario: Checkout action should change current branch
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

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'modelName'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?path=terrator-plugin/modelName'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?path=terrator-plugin/modelName'

    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote1"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote1"]'
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="checkout-loader_test/remote1"]' not exists
    And  I expect '[data-cy="git-current-branch-button"]' is 'test/remote1'
