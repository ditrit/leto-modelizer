Feature: Test modelizer text view: change git branch

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


  Scenario: Checkout action should change current branch
    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-branch-remote-test/remote1\"]"
    And I click on "[data-cy=\"git-menu-branch-checkout-test/remote1\"]"
    Then I expect "[data-cy=\"git-menu-branch-checkout-loader-test/remote1\"]" not exists
    And I expect "[data-cy=\"git-current-branch\"] " is "test/remote1"
