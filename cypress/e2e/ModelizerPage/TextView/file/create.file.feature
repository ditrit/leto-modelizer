Feature: Test modelizer text view: create file and folder

  Background:
    Given I clear cache
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

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'modelName'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?path=terrator-plugin/modelName'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I wait 2 seconds

  Scenario: Create a file inside the root folder should expand the root folder and open corresponding active tab
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    #  New active tab is open with created file's label
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFile.js'
    #  Created file is added inside file explorer and file tabs
    And  I expect '[data-cy="file_newFile.js"]' appear 2 times on screen
    #  Created file's label is red
    And  I expect '.file-status-untracked' appear 2 times on screen
    And  I expect '[data-cy="file_newFile.js"].file-status-untracked' exists
    #  Root folder is expanded
    And  I expect '[data-cy="folder-icon_{{ projectName }}"].fa-folder-open' exists

  Scenario: Create a file inside sub-folder should open corresponding active tab and expand the parent folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    #  New tab is open with created file's label
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFile.js'
    #  Created file is added inside file explorer and file tabs
    And  I expect '[data-cy="file_terraform/newFile.js"]' appear 2 times on screen
    #  Created file's label is red
    And  I expect '.file-status-untracked' appear 2 times on screen
    And  I expect '[data-cy="file_terraform/newFile.js"].file-status-untracked' exists
    #  Parent folder is expanded
    And  I expect '[data-cy="file-explorer"] [data-cy="folder-icon_terraform"].fa-folder-open' exists
  
  Scenario: Create a folder inside the root folder should expand root folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFolder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    #  No tab open
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 0 time on screen
    #  Created folder is added inside file explorer
    And  I expect '[data-cy="folder_newFolder"]' appear 1 time on screen
    #  Root folder is expanded, created folder is not expanded
    And  I expect '[data-cy="folder-icon_{{ projectName }}"].fa-folder-open' exists
    And  I expect '[data-cy="folder-icon_newFolder"].fa-folder' exists

  Scenario: Create a folder inside folder should expand parent folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFolder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    #  No tab open
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 0 time on screen
    #  Created folder is added inside file explorer
    And  I expect '[data-cy="folder_terraform/newFolder"]' appear 1 time on screen
    #  Root and parent folder are expanded, created folder is not expanded
    And  I expect '[data-cy="folder-icon_{{ projectName }}"].fa-folder-open' exists
    And  I expect '[data-cy="folder-icon_terraform"].fa-folder-open' exists
    And  I expect '[data-cy="folder-icon_terraform/newFolder"].fa-folder' exists
