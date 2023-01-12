Feature: Test modelizer model view: add plugin component

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I expect "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]" appear 1 time on screen
    And  I expect "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"] [data-cy=\"plugin-definitions-title\"]" is "leto-modelizer-plugin-test"

    Given I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    
    When I click on "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]"
    Then I expect "[class*=\"component-definition-card\"]" appear 7 times on screen

  Scenario Outline: Click on the <element> component should display it on the page
    Then I expect "[data-cy=\"modelizer-model-view-draw-root\"] [id^=\"<element>_\"]" not exists

    When I click on "[data-cy=\"component-definition-<element>\"]"
    Then I expect "[data-cy=\"modelizer-model-view-draw-root\"] [id^=\"<element>_\"]" exists
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"] [id^=\"<element>_\"]" appear 1 time on screen

    Examples:
      | element   |
      | truck     |
      | box       |
      | envelope  |
      | paper     |
      | image     |
      | money     |
      | gift      |
