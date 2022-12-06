Feature: Test modelizer text view: update git branch

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


  Scenario: Update action should be available only for branch that are local and remote
    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-branch-local-main\"]"
    Then I expect "[data-cy=\"git-menu-branch-update-main\"]" exists
    And I click on "[data-cy=\"git-menu-branch-local-main\"]"

    When I click on "[data-cy=\"git-menu-branch-remote-main\"]"
    Then I expect "[data-cy=\"git-menu-branch-update-main\"]" exists
    And I click on "[data-cy=\"git-menu-branch-remote-main\"]"

    When I click on "[data-cy=\"git-menu-branch-remote-test/remote1\"]"
    Then I expect "[data-cy=\"git-menu-branch-update-test/remote1\"]" not exists
    And I click on "[data-cy=\"git-menu-branch-remote-test/remote1\"]"

  Scenario: Execute update action with fast forward should be a success
    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-branch-local-main\"]"
    And I click on "[data-cy=\"git-menu-branch-update-main\"]"
    Then I expect checkbox "[data-cy=\"git-fastForward-checkbox\"]" is checked

    When I click on "[data-cy=\"git-update-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-update-form\"]" is closed
    And I expect "positive" toast to appear with text "Branch is updated 🥳!"

  Scenario: Execute update action without fast forward should be a success
    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-branch-local-main\"]"
    And I click on "[data-cy=\"git-menu-branch-update-main\"]"
    And I click on "[data-cy=\"git-fastForward-checkbox\"]"
    Then I expect checkbox "[data-cy=\"git-fastForward-checkbox\"]" is not checked

    When I click on "[data-cy=\"git-update-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-update-form\"]" is closed
    And I expect "positive" toast to appear with text "Branch is updated 🥳!"
