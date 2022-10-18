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

  Scenario: Create new branch action with checkout option should create a new branch and checkout on it
    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    Then I expect checkbox "[data-cy=\"git-checkout-checkbox\"]" is checked
    And I expect "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" exists

    When I wait 2 seconds
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]"
    And I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "test-new-branch"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-newBranch-form\"]" is closed
    And I expect "positive" toast to appear with text "Branch is created 🥳!"
    And I expect "[data-cy=\"git-current-branch\"] " is "test-new-branch"


  Scenario: Scenario: Create new branch action without checkout option should create a new branch and not checkout on it
    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    And I click on "[data-cy=\"git-checkout-checkbox\"]"
    Then I expect checkbox "[data-cy=\"git-checkout-checkbox\"]" is not checked

    When I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "test-new-branch"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-newBranch-form\"]" is closed
    And I expect "positive" toast to appear with text "Branch is created 🥳!"
    And I expect "[data-cy=\"git-current-branch\"] " is "main"
