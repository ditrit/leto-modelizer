@skip
# TODO: update/fix test
Feature: Test modelizer text view: git log display

  Background:
    Given I clear cache
    And   I set viewport size to "1536" px for width and "960" px for height

    When I visit the "/"
    And  I click on '[data-cy="new-project"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="submit-button"]'
    Then I expect current url is "/modelizer/projectName/model"

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-menu-log"]' exists

  Scenario: Display dialog containing the list of logs
    When I wait 1 second
    And  I click on '[data-cy="git-menu-log"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]]' appear 1 time on screen
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]]' is "Initial commit."
