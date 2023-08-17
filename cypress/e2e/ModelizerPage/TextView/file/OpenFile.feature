Feature: Test modelizer text view: open file

  Background:
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I set on '[data-cy="import-project-form"] [data-cy="username-input"]' text 'test'
    And  I set on '[data-cy="import-project-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'
    And  I expect '[data-cy="import-project-form"]' is closed
    And  I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="project-name"]' is '{{ projectName }}'

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=infra'

    # Go to text view and check files
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=infra'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_README.md"]' exists

    When I wait 2 second
    And  I click on '[data-cy="active-tab"] [data-cy="close-button"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 0 time on screen

  Scenario: Double click on a file should open a tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    Then I expect '[data-cy="file-tabs"]' exists
    And  I expect '[data-cy="monaco-editor"]' exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_README.md"]' is 'README.md'

  Scenario: Open a file and click to close the active tab should display nothing on the file tabs
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs"]' exists
    And  I expect '[data-cy="monaco-editor"]' exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'

    When I click on '[data-cy="active-tab"] [data-cy="close-button"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 0 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' not exists
    And  I expect '[data-cy="monaco-editor"]' not exists

  Scenario: Open two files then click on the inactive tab, it should switch and become active tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'README.md'
    And  I expect '[data-cy="file_branch.txt"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists

    When I click on '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' not exists

  Scenario: Open two files then click on the inactive file, its corresponding tab should switch and become active tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_branch.txt"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' not exists

  Scenario: Open two files and click to close the active tab, the other opened tab becomes the active tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_branch.txt"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists

    When I click on '[data-cy="active-tab"] [data-cy="close-button"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' not exists

  Scenario: Open a file and checkout branch, the file should reload if its panel has changed
    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'

    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    Then I expect '[data-cy="git-current-branch-button"]' is 'test/remote'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'test/remote'

  Scenario: Open two files, checkout branch and if an opened file no longer exists, its corresponding tab should be closed
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'

    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    Then I expect '[data-cy="git-current-branch-button"]' is 'test/remote'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'test/remote'

  Scenario: Open two files and checkout branch, then the active tab is closed, the other opened tab becomes the active tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'
    Then I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists

    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    Then I expect '[data-cy="git-current-branch-button"]' is 'test/remote'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'test/remote'
