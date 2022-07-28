Feature: homepage

Scenario: Create project should redirect to project page and save it in browser cache
  Given I clear localstorage
  Given I visit the "/"
  When I click on "[data-cy=\"create-empty-project\"]"
  Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
  And  I extract "project-[a-f0-9]{8}" from url in field "projectId" of context
  And I expect localstorage field "projects" is '{"{{ projectId }}":{"id":"{{ projectId }}"}}'

Scenario: Open existing project
  Given I clear localstorage
  Given I set in localstorage field "projects" with '{"project-0001":{"id":"project-0001"}}' as "json"
  Given I visit the "/"
  When I click on "[data-cy=\"project-card-project-0001\"]"
  Then I expect current url is "/modelizer/project-0001/model"
