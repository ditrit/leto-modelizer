Feature: Test homepage: project creation

  Background:
    Given I clear cache
    And I visit the "/"
    And I click on "[data-cy=\"new-project\"]"

  Scenario: Create project should redirect to project model view page
    Then I expect current url is "modelizer/project-[a-f0-9]{8}/model"

  Scenario: Create project should save it in browser cache
    Then I expect current url is "modelizer/project-[a-f0-9]{8}/model"
    And I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And I expect localstorage field "projects" is '{"{{ projectName }}":{"id":"{{ projectName }}"}}'
