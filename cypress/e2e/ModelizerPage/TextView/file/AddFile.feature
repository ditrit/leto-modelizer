Feature: Test modelizer text view: add file

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
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

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I wait 2 seconds

  # Git roundtrip
  Scenario: An unmodified file should not have the 'add' action inside file explorer menu
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_README.md"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_README.md"]'
    Then I expect '[data-cy="file_README.md"].file-status-unmodified' exists
    And  I expect '[data-cy="file-explorer-action-menu"]' exists
    But  I expect '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]' not exists

  # Git roundtrip
  Scenario: Create a file inside the root folder and add it on git should change the file's status
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '.file-status-untracked' appear 4 times on screen
    And  I expect '[data-cy="file_newFile.js"].file-status-untracked' exists

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_newFile.js"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'
    Then I expect 'positive' toast to appear with text 'File is added &#129395;!'
    And  I expect '[data-cy="file_newFile.js"].file-status-staged' exists

  # Git roundtrip
  Scenario: Create a file inside sub-folder and add it on git should change the file's status
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '.file-status-untracked' appear 4 times on screen
    And  I expect '[data-cy="file_terraform/newFile.js"].file-status-untracked' exists

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_terraform/newFile.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_terraform/newFile.js"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'
    Then I expect 'positive' toast to appear with text 'File is added &#129395;!'
    And  I expect '[data-cy="file_terraform/newFile.js"].file-status-staged' exists
