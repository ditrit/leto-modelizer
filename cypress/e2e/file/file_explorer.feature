Feature: Test file explorer and file tabs

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"create-empty-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And  I visit the "/#/modelizer/{{projectName}}/text"

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu\"]"
    And  I set on "[data-cy=\"git-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I set on "[data-cy=\"git-form\"] [data-cy=\"git-username-input\"]" text "test"
    And  I set on "[data-cy=\"git-form\"] [data-cy=\"git-token-input\"]" text "test"
    And  I click on "[data-cy=\"git-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect "[data-cy=\"git-form\"]" is closed
    And  I expect "[data-cy=\"git-current-branch\"] " is "master"

    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-branch-remote-test/remote\"]"
    And  I click on "[data-cy=\"git-menu-branch-checkout-test/remote\"]"
    And  I expect "[data-cy=\"git-current-branch\"]" is "test/remote"
    And  I click on body to close popup
    Then I expect "[data-cy=\"file-explorer\"]" exists
    And  I click on "[data-cy=\"file-explorer\"]"

  Scenario: Double click on a file should open a tab
    When I double click on "[data-cy=\"file-explorer-README.md\"]"
    Then I expect "[data-cy=\"file-tabs\"]" exists
    And  I expect "[data-cy=\"monaco-editor\"]" exists
    And  I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tab-label-README.md\"]" is "README.md"

  Scenario: Open a file and click to close the active tab should display nothing on the file tabs
    When I double click on "[data-cy=\"file-explorer-README.md\"]"
    Then I expect "[data-cy=\"file-tabs\"]" exists
    And  I expect "[data-cy=\"monaco-editor\"]" exists
    And  I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"

    When I click on "[data-cy=\"active-tab\"] [data-cy=\"close-file-tab\"]"
    And  I expect "[data-cy=\"file-tabs-container\"]" appear 0 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" not exists
    And  I expect "[data-cy=\"monaco-editor\"]" not exists

  Scenario: Open two files then click on the inactive file and tab should switch the active tab
    When I double click on "[data-cy=\"file-explorer-README.md\"]"
    Then I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tab-content-README.md\"]" exists

    When I double click on "[data-cy=\"file-explorer-branch.txt\"]"
    And  I expect "[data-cy=\"file-tabs-container\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tab-label-branch.txt\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "test/remote"
    And  I expect "[data-cy=\"file-tab-content-README.md\"]" not exists

    When I click on "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tabs-container\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" not exists

  Scenario: Open two files and click to close the active tab, the other opened tab becomes the active tab
    When I double click on "[data-cy=\"file-explorer-README.md\"]"
    And  I double click on "[data-cy=\"file-explorer-branch.txt\"]"
    Then I expect "[data-cy=\"file-tabs-container\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tab-label-branch.txt\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "test/remote"
    And  I expect "[data-cy=\"file-tab-content-README.md\"]" not exists

    When I click on "[data-cy=\"active-tab\"] [data-cy=\"close-file-tab\"]"
    And  I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tab-content-README.md\"]" exists
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" not exists

  Scenario: Open a file and checkout branch, the file should reload if its content has changed
    When I double click on "[data-cy=\"file-explorer-branch.txt\"]"
    Then I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "test/remote"

    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-branch-remote-main\"]"
    And  I click on "[data-cy=\"git-menu-branch-checkout-main\"]"
    And  I expect "[data-cy=\"git-current-branch\"]" is "main"
    And  I click on body to close popup
    Then I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "main"

  Scenario: Open two files, checkout branch and if an opened file no longer exists, its corresponding tab should be closed
    When I double click on "[data-cy=\"file-explorer-README.md\"]"
    And  I double click on "[data-cy=\"file-explorer-branch.txt\"]"
    Then I expect "[data-cy=\"file-tabs-container\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "test/remote"

    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-branch-remote-main\"]"
    And  I click on "[data-cy=\"git-menu-branch-checkout-main\"]"
    And  I expect "[data-cy=\"git-current-branch\"]" is "main"
    And  I click on body to close popup
    Then I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tab-content-README.md\"]" not exists
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "main"

  Scenario: Open two files and checkout branch, then the active tab is closed, the other opened tab becomes the active tab
    When I double click on "[data-cy=\"file-explorer-branch.txt\"]"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "test/remote"
    Then I double click on "[data-cy=\"file-explorer-README.md\"]"
    And  I expect "[data-cy=\"file-tabs-container\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-README.md\"]" exists

    When I click on "[data-cy=\"git-current-branch\"]"
    And  I click on "[data-cy=\"git-menu-branch-remote-main\"]"
    And  I click on "[data-cy=\"git-menu-branch-checkout-main\"]"
    And  I expect "[data-cy=\"git-current-branch\"]" is "main"
    And  I click on body to close popup
    Then I expect "[data-cy=\"file-tabs-container\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tab-content-README.md\"]" not exists
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "branch.txt"
    And  I expect "[data-cy=\"file-tab-content-branch.txt\"]" is "main"

