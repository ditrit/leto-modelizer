Feature: Test modelizer text view: create git branch

  Background:
    Given I clear cache
    And I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And I set context field "projectName" with "leto-modelizer-project-test"
    And I visit the "/"

    When I click on '[data-cy="import-project"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="git-repository-input"]' text "{{ repository_url }}"
    And  I set on '[data-cy="import-project-form"] [data-cy="git-username-input"]' text "test"
    And  I set on '[data-cy="import-project-form"] [data-cy="git-token-input"]' text "test"
    And  I click on '[data-cy="import-project-form"] [data-cy="import-project-form-submit"]'
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And  I expect '[data-cy="import-project-form"]' is closed
    And  I visit the "/#/modelizer/{{projectName}}/text"

  Scenario: Create new branch action with checkout option should create a new branch and checkout on it
    When I click on '[data-cy="git-current-branch"]'
    And  I click on '[data-cy="git-menu-new-branch"]'
    Then I expect checkbox '[data-cy="git-checkout-checkbox"]' is checked
    And  I expect '[data-cy="git-newBranch-form"] [data-cy="git-branch-input"]' exists

    When I wait 2 seconds
    And  I click on '[data-cy="git-newBranch-form"] [data-cy="git-branch-input"]'
    And  I set on '[data-cy="git-newBranch-form"] [data-cy="git-branch-input"]' text "test-new-branch"
    And  I click on '[data-cy="git-newBranch-form"] [data-cy="git-form-submit"]'
    Then I expect '[data-cy="git-newBranch-form"]' is closed
    And  I expect "positive" toast to appear with text "Branch is created 🥳!"
    And  I expect '[data-cy="git-current-branch"]' is "test-new-branch"


  Scenario: Create new branch action without checkout option should create a new branch and not checkout on it
    When I click on '[data-cy="git-current-branch"]'
    And  I click on '[data-cy="git-menu-new-branch"]'
    And  I click on '[data-cy="git-checkout-checkbox"]'
    Then I expect checkbox '[data-cy="git-checkout-checkbox"]' is not checked

    When I set on '[data-cy="git-newBranch-form"] [data-cy="git-branch-input"]' text "test-new-branch"
    And  I click on '[data-cy="git-newBranch-form"] [data-cy="git-form-submit"]'
    Then I expect '[data-cy="git-newBranch-form"]' is closed
    And  I expect "positive" toast to appear with text "Branch is created 🥳!"
    And  I expect '[data-cy="git-current-branch"]' is "main"
