Feature: Test git settings dialog

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And I visit the "/#/modelizer/{{ projectName }}/text"

  Scenario: Set valid git settings in the project
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-settings-form\"]" is closed
    And I expect localstorage field "projects" is '{"{{ projectName }}":{"id":"{{ projectName }}","git":{"repository":"https://github.com/ditrit/leto-modelizer-project-test","username":"test","token":"test"}}}'

  Scenario: Set bad repository url should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" text "bad"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-settings-form\"] [role=\"alert\"]" is "Invalid repository url"

  Scenario: Set empty repository should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" is ""
    And I expect "[data-cy=\"git-settings-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Set empty username should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" is ""
    And I expect "[data-cy=\"git-settings-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Set empty token should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" is ""
    And I expect "[data-cy=\"git-settings-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Each project should have its own value of git settings
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-settings-form\"]" is closed

    When I click on "[data-cy=\"app-logo-link\"]"
    Then I expect current url is "/"

    When I click on "[data-cy=\"new-project\"]"
    And I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    Then I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" is ""
    And I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" is ""
    And I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" is ""

    When I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-plugin-core"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" text "test2"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" text "test2"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-settings-form\"]" is closed

    When I visit the "/#/modelizer/{{ projectName }}/text"
    And I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    Then I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" is "https://github.com/ditrit/leto-modelizer-project-test"
    And I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" is "test"
    And I expect field "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" is "test"

  Scenario: Save git settings twice should not duplicate branches in branch menu
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-settings-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"

    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-settings-form\"]" is closed

    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-master\"]" appear 1 time on screen

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I click on "[data-cy=\"git-settings-form\"] [data-cy=\"git-form-submit\"]"

    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-settings-form\"]" is closed

    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-branch-local-master\"]" exists
    And I expect "[data-cy=\"git-menu-branch-local-master\"]" appear 1 time on screen
