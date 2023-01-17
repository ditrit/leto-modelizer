Feature: Test modelizer model view: plugin initialization

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

  Scenario Outline: Set text as "<filter>" should display only one element
    When I click on "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]"
    Then I expect "[class*=\"plugin-definitions\"]" appear 1 time on screen
    And I expect "[class*=\"component-definition-card\"]" appear 7 times on screen

    When I set on "[data-cy=\"filter-plugin-definitions\"]" text "<filter>"
    And I expect "[class*=\"component-definition-card\"]" appear 1 time on screen
    And I expect "[data-cy=\"component-definition-<filter>\"]" exists

    Examples:
      | filter   |
      | truck    |
      | box      |
      | envelope |
      | paper    |
      | image    |
      | money    |
      | gift     |

  Scenario Outline: Set text as "<filter>" should display only two elements
    When I click on "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]"
    Then I expect "[class*=\"plugin-definitions\"]" appear 1 time on screen
    And I expect "[class*=\"component-definition-card\"]" appear 7 times on screen

    When I set on "[data-cy=\"filter-plugin-definitions\"]" text "<filter>"
    And I expect "[class*=\"component-definition-card\"]" appear 2 times on screen
    And I expect "[data-cy=\"component-definition-<element1>\"]" exists
    And I expect "[data-cy=\"component-definition-<element2>\"]" exists

    Examples:
      | filter      | element1 | element2 |
      | truck box   | truck    | box      |
      | paper truck | paper    | truck    |
      | u x         | truck    | box      |

  Scenario Outline: Set text as "<filter>" should not display any elements.
    When I click on "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]"
    Then I expect "[class*=\"plugin-definitions\"]" appear 1 time on screen
    And I expect "[class*=\"component-definition-card\"]" appear 7 times on screen

    When I set on "[data-cy=\"filter-plugin-definitions\"]" text "<filter>"
    And I expect "[class*=\"component-definition-card\"]" appear 0 time on screen
    Examples:
      | filter   |
      | bad      |
      | truckbox |
