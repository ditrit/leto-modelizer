@skip
# TODO: update/fix test
Feature: Test modelizer text view: git commit

  Background:
    Given I clear cache
    And   I set viewport size to "1536" px for width and "960" px for height

    When I visit the "/"
    And  I click on '[data-cy="new-project-button"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="submit-button"]'
    Then I expect current url is "/modelizer/projectName/model"

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I click on '[data-cy="git-current-branch-button"]'
    And  I wait 1 second
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]' exists

  Scenario: Commit with no change
    When I click on '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="empty-item"]' exists

  Scenario: Commit an added file without commit message fails
    #  Check list of logs
    When I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]]' appear 1 time on screen

    When I click on '[data-cy="close-dialog-button"]'
    Then I expect '[data-cy="git-log-dialog"]' not exists

    #  Create a file
    When I hover '[data-cy="file-button_projectName"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_projectName"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text "newFile.js"
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_newFile.js"]' appear 1 time on screen

    #  Add file
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'

    #  Commit
    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]' exists

    When I click on '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-title"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-file"]' appear 1 time on screen

    #  Empty commit message displays an error
    When I click on '[data-cy="git-commit-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-form"] [role="alert"]' is "Please type something"

    #  New commit message is not added inside list of logs
    When I click on '[data-cy="close-dialog-button"]'
    And  I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]]' appear 1 times on screen

  Scenario: Commit an added file with commit message succeeds
    #  Check list of logs
    When I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]]' appear 1 time on screen

    When I click on '[data-cy="close-dialog-button"]'
    Then I expect '[data-cy="git-log-dialog"]' not exists

    #  Create a file
    When I hover '[data-cy="folder-button_projectName"]' to make it visible
    And  I click on '[data-cy="folder-button_projectName"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text "newFile.js"
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_newFile.js"]' appear 1 time on screen

    #  Add file
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'

    #  Commit
    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]' exists

    When I click on '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-title"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-file"]' appear 1 time on screen

    #  Valid commit message displays a successful notification
    When I set on '[data-cy="git-commit-form"] [data-cy="message-input"]' text "commit"
    And  I click on '[data-cy="git-commit-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-commit-dialog"]' not exists
    And  I expect "positive" toast to appear with text "Your files are committed &#129395;!"

    #  New commit message is added inside list of logs
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]]' appear 2 times on screen
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]]' is "commit"
