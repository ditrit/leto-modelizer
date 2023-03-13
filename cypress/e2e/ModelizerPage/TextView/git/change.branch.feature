Feature: Test modelizer text view: change git branch

  Background:
    Given I clear cache
    And I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And I set context field "projectName" with "leto-modelizer-project-test"
    And I visit the "/"

    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text "{{ repository_url }}"
    And  I set on '[data-cy="import-project-form"] [data-cy="username-input"]' text "test"
    And  I set on '[data-cy="import-project-form"] [data-cy="token-input"]' text "test"
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And  I expect '[data-cy="import-project-form"]' is closed
    And  I visit the "/#/modelizer/{{projectName}}/text"


  Scenario: Checkout action should change current branch
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-menu-branch-remote-test/remote1"]'
    And  I click on '[data-cy="git-menu-branch-checkout-test/remote1"]'
    Then I expect '[data-cy="git-menu-branch-checkout-loader-test/remote1"]' not exists
    And  I expect '[data-cy="git-current-branch-button"]' is "test/remote1"
