Feature: Test modelizer text view: filter git branch

  Background:
    Given I clear cache
    And I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And I set context field "projectName" with "leto-modelizer-project-test"
    And I visit the "/"

    When I click on "[data-cy=\"import-project\"]"
    And I set on "[data-cy=\"import-project-form\"] [data-cy=\"git-repository-input\"]" text "{{ repository_url }}"
    And I set on "[data-cy=\"import-project-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"import-project-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"import-project-form\"] [data-cy=\"import-project-form-submit\"]"
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And I expect "[data-cy=\"import-project-form\"]" is closed
    And I visit the "/#/modelizer/{{projectName}}/text"

  Scenario: Expect to have no branch with "no_main" filter
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "not_main"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" not exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" not exists

  Scenario: Expect to have main branch with "main" filter
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "not_main"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" not exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" not exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "main"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" exists

  Scenario: Create new branch then check if filter works
    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    Then I expect checkbox "[data-cy=\"git-checkout-checkbox\"]" is checked
    And I expect "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" exists

    When I wait 2 seconds
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]"
    And I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "testNewBranch"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-newBranch-form\"]" is closed
    And I expect "positive" toast to appear with text "Branch is created 🥳!"

    When I click on "[data-cy=\"git-current-branch\"]"
    And I scroll to "bottom" into "[data-cy=\"git-branch-menu\"]"
    Then I expect "[data-cy=\"git-current-branch\"] " is "testNewBranch"
    And I expect "[data-cy=\"git-menu-branch-local-main\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-testNewBranch\"]" exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" exists

    When I scroll to "top" into "[data-cy=\"git-branch-menu\"]"
    And I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "not_main"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" not exists
    And I expect "[data-cy=\"git-menu-branch-local-test-testNewBranch\"]" not exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" not exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "no_main main"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-testNewBranch\"]" not exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "no_main main testNewBranch"
    And I scroll to "bottom" into "[data-cy=\"git-branch-menu\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-main\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-testNewBranch\"]" exists
    And I expect "[data-cy=\"git-menu-branch-remote-main\"]" exists
