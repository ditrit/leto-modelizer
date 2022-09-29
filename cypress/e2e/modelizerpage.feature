Feature: Test modelizer page

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

  Scenario: Default modelizer page mode should be "model"
    When I visit the "/"
    And  I visit the "/#/modelizer/{{projectName}}"
    Then I expect current url is "/modelizer/{{projectName}}/model"

  Scenario: Modelizer "model" page should load the correct content
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists

  Scenario: Modelizer "text" page should load the correct content
    When I visit the "/#/modelizer/{{projectName}}/text"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"monaco-editor\"]" exists

  Scenario: Clicking on switch should change page content
    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"monaco-editor\"]" exists
    And I expect current url is "/{{projectName}}/text"

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    And I expect current url is "/{{projectName}}/model"

  Scenario: Clicking on application logo should redirect to homepage
    When I click on "[data-cy=\"app-logo-link\"]"
    Then I expect current url is "/"

  Scenario: The modelizer page should have the components definitions drawer
    Then I expect '[data-cy="components-definitions-drawer"]' exists

  Scenario: Set git configuration for a project
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-form\"]" is closed
    And I expect localstorage field "projects" is '{"{{ projectName }}":{"id":"{{ projectName }}","git":{"repository":"https://github.com/ditrit/leto-modelizer-project-test","username":"test","token":"test"}}}'

  Scenario: Set bad repository url should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "bad"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Invalid repository url"

  Scenario: Set empty repository should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" is ""
    And I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Set empty username should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" is ""
    And I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Set empty token should display an error
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" is ""
    And I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Each project should have it's own value of git configuration
    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And I expect "[data-cy=\"git-form\"]" is closed

    When I click on "[data-cy=\"app-logo-link\"]"
    Then I expect current url is "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    And I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" is ""
    And I expect field "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" is ""
    And I expect field "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" is ""
