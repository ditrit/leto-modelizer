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

  Scenario: The modelizer page should have the components definitions panel
    Given I set viewport size to "1536" px for width and "960" px for height
    And I clear localstorage
    When I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"
    And I visit the "/#/modelizer/project-0001/"
    Then I expect '[data-cy="components-definitions-panel"]' exists
