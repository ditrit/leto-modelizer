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
