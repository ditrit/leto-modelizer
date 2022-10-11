Feature: Test git branch menu

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And I visit the "/#/modelizer/{{projectName}}/text"

  Scenario: Default branch should be master
    Then I expect "[data-cy=\"git-current-branch\"] " is "master"

  Scenario: Expect to have master in local branches section
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-master\"] [data-cy=\"git-menu-current-branch\"]" exists

  Scenario: Expect to have no branch with "no_master" filter
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "not_master"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" not exists

  Scenario: Expect to have master branch with "master" filter
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "master"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists

  Scenario: Expect to have master branch with "no_master master" filter
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists

    When I set on "[data-cy=\"git-branch-menu-search-bar\"]" text "no_master master"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists

  Scenario: Save git configuration twice should not duplicate branches in branch menu
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"

    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-form\"]" is closed

    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-master\"]" appear 1 time on screen

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"

    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-form\"]" is closed

    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-master\"]" appear 1 time on screen

  Scenario: Expand menu should be closed when menu is open
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"

    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-form\"]" is closed

    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-branch-expand-remote-menu\"] [data-cy=\"git-branch-expand-menu-text\"]" is "Show 3 more..."

    When I click on "[data-cy=\"git-branch-expand-remote-menu\"]"
    Then I expect "[data-cy=\"git-branch-expand-remote-menu\"] [data-cy=\"git-branch-expand-menu-text\"]" is "Show less"

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-branch-expand-remote-menu\"] [data-cy=\"git-branch-expand-menu-text\"]" is "Show 3 more..."

  Scenario: Checkout action should change current branch
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"

    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-form\"]" is closed

    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-menu-branch-remote-test/remote1\"]"
    And I click on "[data-cy=\"git-menu-branch-checkout-test/remote1\"]"
    Then I expect "[data-cy=\"git-menu-branch-checkout-loader-test/remote1\"]" not exists
    And I expect "[data-cy=\"git-current-branch\"] " is "test/remote1"
    And I expect "[data-cy=\"git-menu-branch-local-test/remote1\"]" exists

