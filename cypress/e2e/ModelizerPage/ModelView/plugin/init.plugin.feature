Feature: Test modelizer model view: plugin initialization

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

  Scenario: Plugin test should appear in component definitions list
    Then I expect "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]" exists
    And I expect "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"] [data-cy=\"plugin-definitions-title\"]" is "leto-modelizer-plugin-test"

  Scenario: Should have only one plugin installed with all these definitions
    When I click on "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]"
    Then I expect "[class*=\"plugin-definitions\"]" appear 1 time on screen
    And I expect "[class*=\"component-definition-card\"]" appear 7 times on screen
    And I expect "[data-cy=\"component-definition-truck\"]" exists
    And I expect "[data-cy=\"component-definition-box\"]" exists
    And I expect "[data-cy=\"component-definition-envelope\"]" exists
    And I expect "[data-cy=\"component-definition-paper\"]" exists
    And I expect "[data-cy=\"component-definition-image\"]" exists
    And I expect "[data-cy=\"component-definition-money\"]" exists
    And I expect "[data-cy=\"component-definition-gift\"]" exists
