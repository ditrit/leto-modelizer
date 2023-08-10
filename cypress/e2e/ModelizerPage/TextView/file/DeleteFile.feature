Feature: Test modelizer text view: delete file and folder

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
    And  I wait 2 seconds

  Scenario: Delete a file of the root folder should remove it from file explorer
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_branch.txt"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_branch.txt"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-explorer"] [data-cy="file_branch.txt.js"]' not exists

  Scenario: Delete last file of a sub-folder should not expand sub-folder
    When I click on '[data-cy="file-explorer"] [data-cy="folder_terraform"]'
    And  I hover '[data-cy="file-explorer"] [data-cy="file-button_terraform/app.tf"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_terraform/app.tf"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="folder-icon_{{ projectName }}"].fa-folder-open' exists
    And  I expect '[data-cy="folder-icon_terraform"].fa-folder' exists

  Scenario: Delete last file of a sub-folder should close active tab
    When I click on '[data-cy="file-explorer"] [data-cy="folder_terraform"]'
    And  I double click on '[data-cy="file_terraform/app.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'app.tf'

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_terraform/app.tf"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_terraform/app.tf"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen

  Scenario: Open two files and delete the selected file should close corresponding active tab and select another active tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'branch.txt'

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_branch.txt"]' to make it visible
    And  I wait 1 second
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_branch.txt"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'

  Scenario: Create two files with similar names and delete the selected file should only close its active tab and select the other tab
    # Create 1st file
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    #  New active tab is open with created file's label
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFile'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'

    # Create 2nd file
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFileTwo'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    #  New active tab is open with created file's label
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFileTwo'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'newFile'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_newFile"]' to make it visible
    And  I wait 1 second
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_newFile"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFileTwo'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'

  Scenario: Delete empty folder of the root folder should remove it from file explorer
    #  Create empty folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists
    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists
    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'folder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_folder"]' appear 1 time on screen

    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_folder"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_folder"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists
    And  I expect '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' not exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="folder_folder"]' not exists

  Scenario: Delete non-empty folder should display the checkox to confirm deletion of folder and its content (& keep selected tab open)
    When I double click on '[data-cy="file_README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'

    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists
    And  I expect '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' exists
    And  I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is not checked
    And  I expect '[data-cy="delete-file-form"] [data-cy="submit-button"]' to be disabled

    When I click on '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]'
    Then I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is checked

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    #  Check elements to delete are deleted, and elements to keep are still present
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect '[data-cy="file_terraform"]' not exists
    And  I expect '[data-cy="file_app.tf"]' not exists

  Scenario: Delete folder that contains opened files should remove all the corresponding tabs
    When I click on '[data-cy="file-explorer"] [data-cy="folder_terraform"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_terraform/app.tf"]' exists

    When I double click on '[data-cy="file_terraform/app.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'app.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'

    #  Create 'folder' inside 'terraform' folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'folder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_terraform/folder"]' appear 1 time on screen
    And  I expect '[data-cy="folder-icon_terraform/folder"].fa-folder' exists

    #  Create 'file.js' inside 'folder'
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform/folder"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform/folder"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'file.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file_terraform/folder/file.js"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'file.js'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect '[data-cy="folder-icon_terraform/folder"].fa-folder-open' exists

    #  Delete 'terraform' folder
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists
    And  I expect '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' exists
    And  I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is not checked
    And  I expect '[data-cy="delete-file-form"] [data-cy="submit-button"]' to be disabled

    When I click on '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]'
    Then I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is checked

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    #  Check 'folder', 'app.tf' and 'file.js' are deleted and all tab closed
    And  I expect '[data-cy="file_terraform/folder/file.js"]' not exists
    And  I expect '[data-cy="file_terraform/app.tf"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'main.tf'
    And  I expect '[data-cy="folder_terraform/folder"]' not exists

  Scenario: Delete folder that contains opened files should remove all the corresponding tabs and select another active tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terraform"]'
    Then I expect '[data-cy="file_terraform/app.tf"]' exists

    When I double click on '[data-cy="file_terraform/app.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'app.tf'

    #  Create 'folder' inside 'terraform' folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'folder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="folder_terraform/folder"]' appear 1 time on screen
    And  I expect '[data-cy="folder-icon_terraform/folder"].fa-folder' exists

    #  Create 'file.js' inside 'folder'
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_terraform/folder"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform/folder"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'file.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'

    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file_terraform/folder/file.js"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 4 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'file.js'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect '[data-cy="folder-icon_terraform/folder"].fa-folder-open' exists

    #  Delete 'terraform' folder
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_terraform"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists
    And  I expect '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' exists
    And  I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is not checked
    And  I expect '[data-cy="delete-file-form"] [data-cy="submit-button"]' to be disabled

    When I click on '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]'
    Then I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is checked

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    #  Check 'folder', 'app.tf' and 'file.js' are deleted, related tabs closed and active tab is 'README.md'
    And  I expect '[data-cy="file_terraform/folder/file.js"]' not exists
    And  I expect '[data-cy="file_terraform/app.tf"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'main.tf'
    And  I expect '[data-cy="folder_terraform/folder"]' not exists

  @skip
  Scenario: Save the component in defaultFileName when diagram doesn't have any file
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'main.tf'

    # Delete main.tf
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_infra/main.tf"]' to make it visible
    And  I wait 1 second
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_infra/main.tf"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file_infra/main.tf"]' not exists
    And  I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=infra'

    # Go back to the draw view
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=infra'

    # Add component
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    Then I expect '[data-cy="component-definition_aws"]' exists

    When I click on '[data-cy="component-definition_aws"]'
    Then I expect '[data-cy="draw-container"] [id^="aws"]' exists
    And  I wait 2 seconds

    # Go back to the text view
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file_infra/new_file.tf"]' exists
    And  I expect active file content to contain 'provider.*"aws".*{}'
