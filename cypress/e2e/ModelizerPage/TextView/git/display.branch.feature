Feature: Test modelizer text view: git branch display

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on '[data-cy="new-project-button"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="submit-button"]'
    Then I expect current url is "/modelizer/projectName/model"

    When I visit the "/#/modelizer/projectName/text"

  Scenario: Default branch should be master
    Then I expect '[data-cy="git-current-branch-button"]' is "master"

  Scenario: Expect to have master in local branches section
    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_master"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_master"] [data-cy="git-menu-current-branch"]' exists

