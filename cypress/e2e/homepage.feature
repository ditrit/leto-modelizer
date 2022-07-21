Feature: homepage

Scenario: Create new project should be a success
  Given I visit the "/"
  Then I expect current url is "/"
