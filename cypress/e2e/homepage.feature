Feature: homepage

Scenario: Create new project should be a success
  Given I visit the "/"
  When I click on "[data-cy=\"createEmptyProject\"]"
  Then I expect current url is "/project-[a-zA-Z0-9]{8}/model"
