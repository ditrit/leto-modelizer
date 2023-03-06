@skip
# TODO: update/fix test
Feature: Test modelizer text view: git commit

  Background:
    Given I clear cache
    And   I set viewport size to "1536" px for width and "960" px for height

    When I visit the "/"
    And  I click on "[data-cy=\"new-project\"]"
    And  I set on "[data-cy=\"new-project-form\"] [data-cy=\"project-name-input\"]" text "projectName"
    And  I click on "[data-cy=\"new-project-form\"] [data-cy=\"new-project-form-submit\"]"
    Then I expect current url is "/modelizer/projectName/model"

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    And  I click on "[data-cy=\"git-current-branch\"]"
    And  I wait 1 second
    Then I expect "[data-cy=\"git-menu-commit\"]" exists

  Scenario: Commit with no change
    When I click on "[data-cy=\"git-menu-commit\"]"
    Then I expect "[data-cy=\"git-commit-dialog\"]" exists
    And  I expect "[data-cy=\"git-commit-empty-item\"]" exists

  Scenario: Commit an added file without commit message fails
    #  Check list of logs
    When I click on "[data-cy=\"git-menu-log\"]"
    Then I expect "[data-cy=\"git-log-dialog\"]" exists
    And  I expect "[data-cy=\"git-log-list\"]" exists
    And  I expect "[data-cy=\"git-log-item\"]" appear 1 time on screen

    When I click on "[data-cy=\"dialog-icon-close\"]"
    Then I expect "[data-cy=\"git-log-dialog\"]" not exists

    #  Create a file
    When I hover "[data-cy=\"file-explorer-buttons-projectName\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer-buttons-projectName\"]"
    And  I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-input\"]" text "newFile.js"
    And  I click on "[data-cy=\"create-file-submit\"]"
    Then I expect "[data-cy=\"file-explorer-newFile.js\"] [data-cy=\"file-label-newFile.js\"]" appear 1 time on screen

    #  Add file
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]"
    And  I click on "[data-cy=\"file-explorer-menu-add-file\"]"

    #  Commit
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-commit\"]" exists

    When I click on "[data-cy=\"git-menu-commit\"]"
    Then I expect "[data-cy=\"git-commit-dialog\"]" exists
    And  I expect "[data-cy=\"git-commit-staged-item\"]" exists
    And  I expect "[data-cy=\"git-commit-staged-item-file\"]" appear 1 time on screen

    #  Empty commit message displays an error
    When I click on "[data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-commit-dialog\"]" exists
    And  I expect "[data-cy=\"git-commit-form\"] [role=\"alert\"]" is "Please type something"

    #  New commit message is not added inside list of logs
    When I click on "[data-cy=\"dialog-icon-close\"]"
    And  I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-log\"]"
    Then I expect "[data-cy=\"git-log-dialog\"]" exists
    And  I expect "[data-cy=\"git-log-list\"]" exists
    And  I expect "[data-cy=\"git-log-item\"]" appear 1 times on screen

  Scenario: Commit an added file with commit message succeeds
    #  Check list of logs
    When I click on "[data-cy=\"git-menu-log\"]"
    Then I expect "[data-cy=\"git-log-dialog\"]" exists
    And  I expect "[data-cy=\"git-log-list\"]" exists
    And  I expect "[data-cy=\"git-log-item\"]" appear 1 time on screen

    When I click on "[data-cy=\"dialog-icon-close\"]"
    Then I expect "[data-cy=\"git-log-dialog\"]" not exists

    #  Create a file
    When I hover "[data-cy=\"file-explorer-buttons-projectName\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer-buttons-projectName\"]"
    And  I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-input\"]" text "newFile.js"
    And  I click on "[data-cy=\"create-file-submit\"]"
    Then I expect "[data-cy=\"file-explorer-newFile.js\"] [data-cy=\"file-label-newFile.js\"]" appear 1 time on screen

    #  Add file
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]"
    And  I click on "[data-cy=\"file-explorer-menu-add-file\"]"

    #  Commit
    When I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-menu-commit\"]" exists

    When I click on "[data-cy=\"git-menu-commit\"]"
    Then I expect "[data-cy=\"git-commit-dialog\"]" exists
    And  I expect "[data-cy=\"git-commit-staged-item\"]" exists
    And  I expect "[data-cy=\"git-commit-staged-item-file\"]" appear 1 time on screen

    #  Valid commit message displays a successful notification
    When I set on "[data-cy=\"git-message-input\"]" text "commit"
    And  I click on "[data-cy=\"git-form-submit\"]"
    Then I expect "[data-cy=\"git-commit-dialog\"]" not exists
    And  I expect "positive" toast to appear with text "Your files are committed &#129395;!"

    #  New commit message is added inside list of logs
    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-log\"]"
    Then I expect "[data-cy=\"git-log-dialog\"]" exists
    And  I expect "[data-cy=\"git-log-list\"]" exists
    And  I expect "[data-cy=\"git-log-item\"]" appear 2 times on screen
    And  I expect "[data-cy=\"git-log-item\"]" is "commit"
