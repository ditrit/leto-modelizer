Feature: Test roundtrip of the application: text editor

  ################## CreateFile.feature ##################
  ## 100 Create a file inside the root folder should open corresponding active tab
  ## 101 Create a file inside sub-folder should open corresponding active tab
  ## 102 Create a folder inside the root folder should display it in the file explorer
  ## 103 Create a folder inside folder should display it in the file explorer

  ################## Filter parsable files ##################
  ## 200 Check filter to only show parsable files in file explorer
  ## 201 Uncheck filter should make all files visible again

  ################## SwitchModelFile.feature ##################
  ## 300 Select the file of another model should update url
  ## 301 Select not parsable file should not update url

  ################## OpenFile.feature ##################
  ## 400 Double click on a file should open a tab
  ## 401 Click on the inactive tab should make it become active tab
  ## 402 Click on the inactive file should make its corresponding tab become active tab
  ## 403 After closing the active tab, another opened tab becomes the active tab
  ## 404 Close the last active tab should display nothing on the file tabs

  ################## UpdateFile.feature ##################
  ## 500 Check if the file content is set after being updated
  ## 501 Check if the file updated content is still set after switching tab

  ################## DeleteFile.feature ##################
  ## 600 Delete a file of the root folder should remove it from file explorer
  ## 601 Deletion of the file should close corresponding active tab and select another active tab
  ## 602 Delete last file of a sub-folder should make it not expanded anymore
  ## 603 Delete last file of a sub-folder should close related active tab and select another active tab
  ## 604 Create two files with similar names and delete the selected file should only close its active tab and select the other tab
  ## 605 Delete empty folder of the root folder should remove it from file explorer
  ## 606 Delete non-empty folder should display the checkbox to confirm deletion of folder and its content (& keep active tab open)
  ## 607 Delete folder containing empty folder
  ## 608 Delete folder that contains opened files should remove all the corresponding tabs and select another active tab
  ## 609 Save the component in defaultFileName after deleting the diagram's file

  Scenario: Roundtrip about text editor

    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'diagramFolder' with 'diagram'
    And   I visit the '/'
    And   I wait until the application is loaded

    # Create project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ projectName }}/models'

    # Create model
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ diagramFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ diagramFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    # Go to text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ diagramFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    ## 100 Create a file inside the root folder should open corresponding active tab
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'rootFile.tf'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    # New active tab is open and become active
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'rootFile.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'new_file.tf'
    # Created file is added inside file explorer and file tabs
    And  I expect '[data-cy="file_{{ projectName }}/rootFile.tf"]' appear 2 times on screen

    ## 101 Create a file inside sub-folder should open corresponding active tab
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'nestedFile.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    # New tab is open and become active
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'nestedFile.js'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'rootFile.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'new_file.tf'
    # Created file is added inside file explorer and file tabs
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFile.js"]' appear 2 times on screen

    ## 102 Create a folder inside the root folder should display it in the file explorer
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'rootFolder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    # Verify no new tab is open
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    # Created folder is added inside file explorer
    And  I expect '[data-cy="folder_{{ projectName }}/rootFolder"]' appear 1 time on screen
    # Root folder is expanded, created folder isn't
    And  I expect '[data-cy="folder-icon_{{ projectName }}"].fa-folder-open' exists
    And  I expect '[data-cy="folder-icon_{{ projectName }}/rootFolder"].fa-folder' exists

    ## 103 Create a folder inside folder should display it in the file explorer
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'nestedFolder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    # Verify no new tab is open
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    # Created folder is added inside file explorer
    And  I expect '[data-cy="folder_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]' appear 1 time on screen
    # Root and parent folder are expanded, created folder isn't
    And  I expect '[data-cy="folder-icon_{{ projectName }}"].fa-folder-open' exists
    And  I expect '[data-cy="folder-icon_{{ projectName }}/{{ diagramFolder }}"].fa-folder-open' exists
    And  I expect '[data-cy="folder-icon_{{ projectName }}/{{ diagramFolder }}/nestedFolder"].fa-folder' exists

    ### Setup for tests 200-201
    # Add new parsable file
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'parsableFile.tf'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/parsableFile.tf"]' appear 2 times on screen

    # Add non-parsable file
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'notParsable.txt'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    # Verify all files and folder are displayed
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/rootFolder"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFile.js"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/parsableFile.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]' exists

    ## 200 Check filter to only show parsable files in file explorer
    When I click on '[data-cy="show-parsable-files-checkbox"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/rootFolder"]' exists
    # Folders that don't contain parsable files are still displayed but in grey and italic
    But  I expect '[data-cy="file-explorer"] [data-cy="file-explorer-node_rootFolder"].text-grey.text-italic' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]' not exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFile.js"]' not exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/parsableFile.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]' not exists

    ## 201 Uncheck filter should make all files visible again
    When I click on '[data-cy="show-parsable-files-checkbox"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/rootFolder"]' exists
    # Folders that don't contain parsable files are no longer displayed in grey nor italic
    But  I expect '[data-cy="file-explorer"] [data-cy="file-explorer-node_rootFolder"].text-grey.text-italic' not exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFile.js"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/parsableFile.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]' exists

    ## 300 Select the file of another model should update url
    And  I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ diagramFolder }}/nestedFolder'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ diagramFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path='
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]' exists

    ## 301 Select not parsable file should not update url
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path='
    And  I wait 1 second

    ## 400 Double click on a file should open a tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]'
    Then I expect '[data-cy="file-tabs"]' exists
    And  I expect '[data-cy="monaco-editor"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'

    ## 401 Click on the inactive tab should make it become active tab
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'rootFile.tf'
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists
    And  I expect '[data-cy="file-tab-panel_rootFile.tf"]' not exists

    When I click on '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/rootFile.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'rootFile.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists
    And  I expect '[data-cy="file-tab-panel_rootFile.tf"]' exists
    And  I wait 1 second

    ## 402 Click on the inactive file should make its corresponding tab become active tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'rootFile.tf'
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists
    And  I expect '[data-cy="file-tab-panel_rootFile.tf"]' not exists

    ## 403 After closing the active tab, another opened tab becomes the active tab
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'notParsable.txt'
    And  I expect '[data-cy="active-tab"] [data-cy="close-button_README.md"]' exists

    When I click on '[data-cy="active-tab"] [data-cy="close-button_README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'notParsable.txt'
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists
    And  I expect '[data-cy="file-tab-panel_notParsable.txt"]' exists
    And  I expect '[data-cy="active-tab"] [data-cy="close-button_notParsable.txt"]' exists

    ## 404 Close the last active tab should display nothing on the file tabs
    # Closing all remaining tabs, except for one
    When I click on '[data-cy="active-tab"] [data-cy="close-button_notParsable.txt"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'parsableFile.tf'
    And  I expect '[data-cy="active-tab"] [data-cy="close-button_parsableFile.tf"]' exists

    When I click on '[data-cy="active-tab"] [data-cy="close-button_parsableFile.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/parsableFile.tf"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'nestedFile.js'
    And  I expect '[data-cy="active-tab"] [data-cy="close-button_nestedFile.js"]' exists

    When I click on '[data-cy="active-tab"] [data-cy="close-button_nestedFile.js"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFile.js"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'rootFile.tf'
    And  I expect '[data-cy="active-tab"] [data-cy="close-button_rootFile.tf"]' exists

    When I click on '[data-cy="active-tab"] [data-cy="close-button_rootFile.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/rootFile.tf"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="active-tab"] [data-cy="close-button_new_file.tf"]' exists

    When I click on '[data-cy="active-tab"] [data-cy="close-button_new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 0 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' not exists
    And  I expect '[data-cy="monaco-editor"]' not exists

    ## 500 Check if the file content is set after being updated
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect active file content to contain '#.*projectTest'

    When I set active file content to 'updated content'
    Then I expect active file content to contain 'updated.*content'

    ## 501 Check if the file updated content is still set after switching tab
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'README.md'
    And  I expect active file content to contain ''

    When I set active file content to 'new content'
    And  I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/README.md"]'
    And  I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file-tab-panel_new_file.tf"]' exists
    And  I expect active file content to contain 'new.*content'

    ### Setup for following tests
    And  I expect '[data-cy="inactive-tab"] [data-cy="close-button_README.md"]' exists

    When I click on '[data-cy="inactive-tab"] [data-cy="close-button_README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/README.md"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'rootFile.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'new_file.tf'

    ## 600 Delete a file of the root folder should remove it from file explorer
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/rootFile.tf"]' exists

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/rootFile.tf"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/rootFile.tf"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFile.tf"]' not exists

    ## 601 Deletion of the file should close corresponding active tab and select another active tab
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/rootFile.tf"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    ## 602 Delete last file of a sub-folder should make it not expanded anymore
    # Create one file in rootFolder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/rootFolder"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/rootFolder"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    # rootFolder is expanded, contains the new file and the latter become the active tab
    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'lastFile.md'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="folder-icon_{{ projectName }}/rootFolder"].fa-folder-open' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFolder/lastFile.md"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'lastFile.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'new_file.tf'

    # Delete file
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/rootFolder/lastFile.md"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/rootFolder/lastFile.md"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    # rootFolder is not expanded anymore
    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="folder-icon_{{ projectName }}/rootFolder"].fa-folder-open' not exists
    But  I expect '[data-cy="folder-icon_{{ projectName }}/rootFolder"].fa-folder' exists

    ## 603 Delete last file of a sub-folder should close related active tab and select another active tab
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/rootFolder/lastFile.md"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    ## 604 Create two files with similar names and delete the selected file should only close its active tab and select the other tab
    # Create 1st file
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFile'

    # Create 2nd file
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFileTwo'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFileTwo'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'newFile'

    # Delete second file and check the first become the active file
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/newFileTwo"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/newFileTwo"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/newFileTwo"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFile'

    ## 605 Delete empty folder of the root folder should remove it from file explorer
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/rootFolder"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists
    And  I expect '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' not exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/rootFolder"]' not exists

    ## 606 Delete non-empty folder should display the checkbox to confirm deletion of folder and its content
    # Check nestedFolder and its content exists
    And  I expect '[data-cy="folder_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]' exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]' exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/parsableFile.tf"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]'
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
    # Check folder and related files to delete are deleted
    And  I expect '[data-cy="folder_{{ projectName }}/{{ diagramFolder }}/nestedFolder"]' not exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/notParsable.txt"]' not exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFolder/parsableFile.tf"]' not exists
    # After folder deletion, the active tab is still open
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFile'

    ## 607 Delete folder containing empty folder
    # Create folder 1
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'folder1'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed

    # Create folder 2
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/folder1"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/folder1"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'folder2'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed

    # delete folder 1
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/folder1"]'
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
    And  I expect '[data-cy="folder_folder1"]' not exists
    And  I expect '[data-cy="folder_folder2"]' not exists

    ## 608 Delete folder that contains opened files should remove all the corresponding tabs and select another active tab
    # Check diagramFolder and its content exists
    And  I expect '[data-cy="folder_{{ projectName }}/{{ diagramFolder }}"]' exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFile.js"]' exists

    # Create folder containing files
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-folder-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'folder'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed

    # Create file inside folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}/folder"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}/folder"]'
    Then I expect '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'file.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/newFile"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/{{ diagramFolder }}/folder/file.js"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'file.js'

    # Delete diagramFolder
    When I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists
    And  I expect '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' exists
    And  I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is not checked
    And  I expect '[data-cy="delete-file-form"] [data-cy="submit-button"]' to be disabled

    When I click on '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]'
    Then I expect checkbox '[data-cy="delete-file-form"] [data-cy="confirm-delete-checkbox"]' is checked

    # Check all folders, files and corresponding tabs are deleted and closed
    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Folder is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="folder_{{ projectName }}/{{ diagramFolder }}"]' not exists
    And  I expect '[data-cy="folder_{{ projectName }}/{{ diagramFolder }}/folder"]' not exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/folder"]' not exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/new_file.tf"]' not exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/nestedFile.js"]' not exists
    And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/folder/file.js"]' not exists
    But  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'newFile'

    ## 609 Save the component in defaultFileName after deleting the diagram's file
    # Back to models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-table"]' exists

    # Create diagram with new_file.tf file
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=infra'

    # Go to text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=infra'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    # Delete new_file.tf
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/infra/new_file.tf"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/infra/new_file.tf"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file_{{ projectName }}/infra/new_file.tf"]' not exists
    And  I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=infra'

    # Go back to the draw view
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=infra'

    # Add component
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    Then I expect '[data-cy="component-definition_aws"]' exists

    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 2 seconds
    Then I expect '.id_1.component' exists

    # Go back to the text view
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file_{{ projectName }}/infra/new_file.tf"]' exists
    And  I expect active file content to contain 'provider.*"aws".*{}'

    ## Rename a folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/infra"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/infra"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="rename-file-action-item"]'
    Then I expect '[data-cy="rename-file-dialog"]' exists

    When I set on '[data-cy="rename-file-form"] [data-cy="name-input"]' text ''
    And  I click on '[data-cy="rename-file-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="rename-file-form"] [role="alert"]' is 'Please type something'

    When I set on '[data-cy="rename-file-form"] [data-cy="name-input"]' text 'newFile'
    And  I click on '[data-cy="rename-file-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="rename-file-form"] [role="alert"]' is 'This name already exists.'

    When I set on '[data-cy="rename-file-form"] [data-cy="name-input"]' text 'coucou/infra'
    And  I click on '[data-cy="rename-file-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="rename-file-form"] [role="alert"]' is 'The name must not contain any \'/\' characters.'

    When I set on '[data-cy="rename-file-form"] [data-cy="name-input"]' text 'infra-rename'
    And  I click on '[data-cy="rename-file-form"] [data-cy="submit-button"]'
    And  I wait 2 seconds
    Then I expect 'positive' toast to appear with text 'Folder is renamed.'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/infra-rename"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/infra"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 0 time on screen
