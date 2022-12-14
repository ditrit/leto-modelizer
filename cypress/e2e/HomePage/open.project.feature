Feature: Test homepage: open project

  Scenario: Open existing project
    Given I clear cache
    And I visit the "/"
    And I click on "[data-cy=\"new-project\"]"
    And I expect current url is "modelizer/project-[a-f0-9]{8}/model"
    And I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"app-logo-link\"]"
    Then I expect current url is "/"
    And I expect "[data-cy=\"project-card-{{projectName}}\"]" exists
    And I expect "[data-cy=\"project-card-{{projectName}}\"] [data-cy=\"project-card-title\"]" is "{{projectName}}"

    When I click on "[data-cy=\"project-card-{{projectName}}\"]"
    Then I expect current url is "/modelizer/{{projectName}}/model"
