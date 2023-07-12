Feature: Test modelizer text view: update file content

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I visit the '/'

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

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I wait 1 second

  Scenario: Check if the file content is set after being updated
    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    Then I expect '[data-cy="file_branch.txt"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect active file content to contain 'main'

    When I set active file content to 'updated content'
    Then I expect active file content to contain 'updated.*content'

  Scenario: Check if the file updated content is still set after switching tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    And  I wait 1 second
    Then I expect '[data-cy="file_branch.txt"]' appear 2 times on screen
    And  I expect '[data-cy="file_README.md"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect active file content to contain 'main'

    When I set active file content to 'updated content'
    Then I expect active file content to contain 'updated.*content'

    When I click on '[data-cy="file-tabs-container"] [data-cy="file_README.md"]'
    And  I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_branch.txt"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect active file content to contain 'updated.*content'

  Scenario: Open a file in root folder and update its content should change the file's class
    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    Then I expect '[data-cy="file_branch.txt"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect '[data-cy="file_branch.txt"].file-status-unmodified' exists
    And  I expect active file content to contain 'main'

    When I set active file content to 'updated content'
    Then I expect active file content to contain 'updated.*content'
    And  I expect '[data-cy="file_branch.txt"].file-status-modified' exists

  Scenario: Open a file in sub-folder and update its content should change the file's class
    When I click on '[data-cy="file-explorer"] [data-cy="folder_terraform"]'
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_terraform/app.tf"]'
    Then I expect '[data-cy="file_terraform/app.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'app.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect '[data-cy="file_terraform/app.tf"].file-status-unmodified' exists
    And  I expect active file content to contain 'main'

    When I set active file content to 'updated content'
    Then I expect '[data-cy="file_terraform/app.tf"].file-status-modified' exists
    And  I expect active file content to contain 'updated.*content'

  Scenario: Update a file's content should make the 'add' action available inside file explorer menu
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_branch.txt"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_branch.txt"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists
    And  I expect '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]' not exists
    And  I expect '[data-cy="file_branch.txt"].file-status-unmodified' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    Then I expect active file content to contain 'main'

    When I set active file content to 'updated content'
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_branch.txt"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-explorer-action-menu"]' exists
    And  I expect '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]' exists
    And  I expect '[data-cy="file_branch.txt"].file-status-modified' exists
    And  I expect active file content to contain 'updated.*content'
