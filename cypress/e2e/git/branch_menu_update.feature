Feature: Test git branch menu

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And I visit the "/#/modelizer/{{projectName}}/text"

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"

    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-form\"]" is closed
    And I expect ".q-notification" not exists

    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-branch-remote-main\"]"
    And I click on "[data-cy=\"git-menu-branch-checkout-main\"]"
    Then I expect "[data-cy=\"git-current-branch\"] " is "main"
    And I click on body to close popup

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
