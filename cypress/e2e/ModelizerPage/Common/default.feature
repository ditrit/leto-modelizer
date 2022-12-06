Feature: Test modelizer page: default functionalities

  Scenario: Clicking on application logo should redirect to homepage
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"app-logo-link\"]"
    Then I expect current url is "/"
