Feature: Test modelizer text view: git status display

  Background:
    Given I clear cache
    And   I set viewport size to "1536" px for width and "960" px for height
    And   I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And  I visit the "/#/modelizer/{{projectName}}/text"

  Scenario: Display dialog containing an empty list
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-status\"]" exists

    When I click on "[data-cy=\"git-menu-status\"]"
    Then I expect "[data-cy=\"git-status-dialog\"]" exists
    And  I expect "[data-cy=\"git-status-empty-item\"]" exists

  Scenario: Display file status changes in status dialog
    #  Create a file
    When I hover "[data-cy=\"file-explorer-buttons-{{ projectName }}\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer-buttons-{{ projectName }}\"]"
    And  I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-input\"]" text "newFile.js"
    And  I click on "[data-cy=\"create-file-submit\"]"
    Then I expect "[data-cy=\"file-explorer-newFile.js\"] [data-cy=\"file-label-newFile.js\"]" appear 1 time on screen

    #  Check file status
    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-status\"]"
    Then I expect "[data-cy=\"git-status-dialog\"]" exists
    And  I expect "[data-cy=\"git-status-staged-item\"]" appear 0 time on screen
    And  I expect "[data-cy=\"git-status-modified-item\"]" appear 0 time on screen
    And  I expect "[data-cy=\"git-status-untracked-item\"]" appear 1 time on screen
    And  I click on "[data-cy=\"dialog-icon-close\"]"

    #  Add file
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]"
    Then I click on "[data-cy=\"file-explorer-menu-add-file\"]"

    #  Check file status
    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-status\"]"
    Then I expect "[data-cy=\"git-status-dialog\"]" exists
    And  I expect "[data-cy=\"git-status-staged-item\"]" appear 1 time on screen
    And  I expect "[data-cy=\"git-status-modified-item\"]" appear 0 time on screen
    And  I expect "[data-cy=\"git-status-untracked-item\"]" appear 0 time on screen
    And  I click on "[data-cy=\"dialog-icon-close\"]"

    #  Update file content
    When I set active file content to "updated content"

    #  Check file status
    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-status\"]"
    Then I expect "[data-cy=\"git-status-dialog\"]" exists
    And  I expect "[data-cy=\"git-status-staged-item\"]" appear 1 time on screen
    And  I expect "[data-cy=\"git-status-modified-item\"]" appear 1 time on screen
    And  I expect "[data-cy=\"git-status-untracked-item\"]" appear 0 time on screen
    And  I click on "[data-cy=\"dialog-icon-close\"]"
