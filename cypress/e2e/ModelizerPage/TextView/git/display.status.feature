Feature: Test modelizer text view: git status display

  Background:
    Given I clear cache
    And   I set viewport size to "1536" px for width and "960" px for height
    And   I visit the "/"

    When I click on '[data-cy="new-project-button"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="submit-button"]'
    Then I expect current url is "/modelizer/projectName/model"

    When I visit the "/#/modelizer/projectName/text"

  Scenario: Display dialog containing an empty list
    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-status-item"]' exists

    When I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    Then I expect '[data-cy="git-status-dialog"]' exists
    And  I expect '[data-cy="git-status-dialog"] [data-cy="empty-item"]' exists

  Scenario: Display file status changes in status dialog
    #  Create a file
    When I hover '[data-cy="folder-button_projectName"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_projectName"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text "newFile.js"
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_newFile.js"]' appear 1 time on screen

    #  Check file status
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    Then I expect '[data-cy="git-status-dialog"]' exists
    And  I expect '[data-cy="git-status-dialog"] [data-cy="staged-item"]' appear 0 time on screen
    And  I expect '[data-cy="git-status-dialog"] [data-cy="modified-item"]' appear 0 time on screen
    And  I expect '[data-cy="git-status-dialog"] [data-cy="untracked-item"]' appear 1 time on screen
    And  I click on '[data-cy="close-dialog-button"]'

    #  Add file
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]'
    Then I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'

    #  Check file status
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    Then I expect '[data-cy="git-status-dialog"]' exists
    And  I expect '[data-cy="git-status-dialog"] [data-cy="staged-item"]' appear 1 time on screen
    And  I expect '[data-cy="git-status-dialog"] [data-cy="modified-item"]' appear 0 time on screen
    And  I expect '[data-cy="git-status-dialog"] [data-cy="untracked-item"]' appear 0 time on screen
    And  I click on '[data-cy="close-dialog-button"]'

    #  Update file content
    When I set active file content to "updated content"

    #  Check file status
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    Then I expect '[data-cy="git-status-dialog"]' exists
    And  I expect '[data-cy="git-status-dialog"] [data-cy="staged-item"]' appear 1 time on screen
    And  I expect '[data-cy="git-status-dialog"] [data-cy="modified-item"]' appear 1 time on screen
    And  I expect '[data-cy="git-status-dialog"] [data-cy="untracked-item"]' appear 0 time on screen
    And  I click on '[data-cy="close-dialog-button"]'
