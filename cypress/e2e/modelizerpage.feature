Feature: Test modelizer page

  Scenario: Default modelizer page should be the model
    Given I clear localstorage
    And I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"
    And I visit the "/#/modelizer/project-0001/"
    Then I expect current url is "/project-0001/model"

  Scenario: Modelizer "model" page should load the correct content
    Given I clear localstorage
    And I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"
    And I visit the "/#/modelizer/project-0001/model"

    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view\"]" is "ModelizerModelView"

  Scenario: Modelizer "text" page should load the correct content
    Given I clear localstorage
    And I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"
    And I visit the "/#/modelizer/project-0001/text"

    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"monaco-editor\"]" exists

  Scenario: Clicking on switch should change page content
    Given I clear localstorage
    And I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"
    And I visit the "/#/modelizer/project-0001/model"

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"monaco-editor\"]" exists
    And I expect current url is "/project-0001/text"

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view\"]" is "ModelizerModelView"
    And I expect current url is "/project-0001/model"

  Scenario: Clicking on application logo should redirect to homepage
    Given I clear localstorage
    And I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"
    And I visit the "/#/modelizer/project-0001/"

    Then I expect current url is "/#/modelizer/project-0001/model"

    When I click on "[data-cy=\"app-logo-link\"]"
    Then I expect current url is "/"

  Scenario: The modelizer page should have the components definitions drawer
    Given I set viewport size to "1536" px for width and "960" px for height
    And I clear localstorage
    And I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"

    When I visit the "/#/modelizer/project-0001/"
    Then I expect '[data-cy="components-definitions-drawer"]' exists

  Scenario: Set git configuration for a project
    Given I clear localstorage
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/#/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-form\"]" is closed
    And I expect localstorage field "projects" is '{"{{ projectName }}":{"id":"{{ projectName }}","git":{"repository":"https://github.com/ditrit/leto-modelizer-project-test","username":"test","token":"test"}}}'

  Scenario: Set bad repository url should display an error
    Given I clear localstorage
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/#/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "bad"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Invalid repository url"

  Scenario: Set empty repository should display an error
    Given I clear localstorage
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/#/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" is ""
    And I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Set empty username should display an error
    Given I clear localstorage
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/#/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" is ""
    And I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Set empty token should display an error
    Given I clear localstorage
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/#/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" is ""
    And I expect "[data-cy=\"git-form\"] [role=\"alert\"]" is "Please type something"

  Scenario: Each project should have it's own value of git configuration
    Given I clear localstorage
    And I add project in localstorage with '{"id":"project1","git":{"repository":"git@github.com/project1.git","token":"t1"}}'
    And I add project in localstorage with '{"id":"project2","git":{"repository":"git@github.com/project2.git","token":"t2"}}'

    When I visit the "/#/modelizer/project1/model"
    And I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" is "git@github.com/project1.git"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" is "t1"

    When I visit the "/#/modelizer/project2/model"
    And I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-settings-menu\"]"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" is "git@github.com/project2.git"
    Then I expect field "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" is "t2"
