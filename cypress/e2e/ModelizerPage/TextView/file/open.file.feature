Feature: Test modelizer text view: open file

  Background:
    Given I clear cache
    And  I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And  I set context field "projectName" with "leto-modelizer-project-test"
    And  I visit the "/"

    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text "{{ repository_url }}"
    And  I set on '[data-cy="import-project-form"] [data-cy="username-input"]' text "test"
    And  I set on '[data-cy="import-project-form"] [data-cy="token-input"]' text "test"
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And  I expect '[data-cy="import-project-form"]' is closed
    And  I expect current url is "modelizer/{{ projectName }}/model"
    And  I expect '[data-cy="project-name"]' is "{{ projectName }}"

    When I visit the "/#/modelizer/{{projectName}}/text"
    Then I expect '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]' exists
    And  I wait 2 seconds
    And  I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'

  Scenario: Double click on a file should open a tab
    When I double click on '[data-cy="file-explorer-README.md"]'
    Then I expect '[data-cy="file-tabs"]' exists
    And  I expect '[data-cy="monaco-editor"]' exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"
    And  I expect '[data-cy="file-label-README.md"]' is "README.md"

  Scenario: Open a file and click to close the active tab should display nothing on the file tabs
    When I double click on '[data-cy="file-explorer-README.md"]'
    Then I expect '[data-cy="file-tabs"]' exists
    And  I expect '[data-cy="monaco-editor"]' exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"

    When I click on '[data-cy="active-tab"] [data-cy="close-button"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 0 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' not exists
    And  I expect '[data-cy="monaco-editor"]' not exists

  Scenario: Open two files then click on the inactive tab, it should switch and become active tab
    When I double click on '[data-cy="file-explorer-README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists

    When I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is "README.md"
    And  I expect '[data-cy="file-label-branch.txt"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "main"
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists

    When I click on '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' not exists

  Scenario: Open two files then click on the inactive file, its corresponding tab should switch and become active tab
    When I double click on '[data-cy="file-explorer-README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists

    When I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is "README.md"
    And  I expect '[data-cy="file-label-branch.txt"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "main"
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists

    When I double click on '[data-cy="file-explorer-README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' not exists

  Scenario: Open two files and click to close the active tab, the other opened tab becomes the active tab
    When I double click on '[data-cy="file-explorer-README.md"]'
    And  I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is "README.md"
    And  I expect '[data-cy="file-label-branch.txt"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "main"
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists

    When I click on '[data-cy="active-tab"] [data-cy="close-button"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' not exists

  Scenario: Open a file and checkout branch, the file should reload if its content has changed
    When I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "main"

    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    Then I expect '[data-cy="git-current-branch-button"]' is "test/remote"
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "test/remote"

  Scenario: Open two files, checkout branch and if an opened file no longer exists, its corresponding tab should be closed
    When I double click on '[data-cy="file-explorer-README.md"]'
    And  I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "main"

    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    Then I expect '[data-cy="git-current-branch-button"]' is "test/remote"
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "test/remote"

  Scenario: Open two files and checkout branch, then the active tab is closed, the other opened tab becomes the active tab
    When I double click on '[data-cy="file-explorer-branch.txt"]'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "main"
    Then I double click on '[data-cy="file-explorer-README.md"]'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "README.md"
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists

    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    Then I expect '[data-cy="git-current-branch-button"]' is "test/remote"
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is "test/remote"
