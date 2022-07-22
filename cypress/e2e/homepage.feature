Feature: homepage

Scenario: Create new project should go to the modelizer page of project
  Given I clear localstorage
  And I visit the "/"
  When I click on "[data-cy=\"createEmptyProject\"]"
  Then I expect current url is "/project-[a-zA-Z0-9]{8}/model"
