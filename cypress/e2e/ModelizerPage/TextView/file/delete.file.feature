Feature: Test modelizer text view: delete file and folder

  Background:
    Given I clear cache
    And I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And I set context field "projectName" with "leto-modelizer-project-test"
    And I visit the "/"

    When I click on "[data-cy=\"import-project\"]"
    And  I set on "[data-cy=\"import-project-form\"] [data-cy=\"git-repository-input\"]" text "{{ repository_url }}"
    And  I set on "[data-cy=\"import-project-form\"] [data-cy=\"git-username-input\"]" text "test"
    And  I set on "[data-cy=\"import-project-form\"] [data-cy=\"git-token-input\"]" text "test"
    And  I click on "[data-cy=\"import-project-form\"] [data-cy=\"import-project-form-submit\"]"
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And  I expect "[data-cy=\"import-project-form\"]" is closed
    And  I expect current url is "modelizer/{{ projectName }}/model"
    And  I expect "[data-cy=\"project-name\"]" is "{{ projectName }}"

    When I visit the "/#/modelizer/{{projectName}}/text"
    Then I expect "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]" exists
    And  I wait 2 seconds

  Scenario: Delete a file of the root folder should remove it from file explorer
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-branch.txt\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-branch.txt\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-branch.txt.js\"]" not exists

  Scenario: Delete last file of a sub-folder should not expand sub-folder
    Given I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-terraform\"]"

    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-app.tf\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-app.tf\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    And  I expect "[data-cy=\"file-explorer-icon-{{ projectName }}\"].fa-folder-open" exists
    And  I expect "[data-cy=\"file-explorer-icon-terraform\"].fa-folder" exists
  
  Scenario: Delete last file of a sub-folder should close active tab
    Given I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-terraform\"]"

    When I double click on "[data-cy=\"file-explorer-app.tf\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "app.tf"

    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-app.tf\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-app.tf\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 0 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" not exists

  Scenario: Open two files and delete the selected file should close corresponding active tab and select another active tab
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I double click on "[data-cy=\"file-explorer-branch.txt\"]"
    And  I double click on "[data-cy=\"file-explorer-README.md\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "branch.txt"

    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-branch.txt\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-branch.txt\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"

  Scenario: Delete empty folder of the root folder should remove it from file explorer
    #  Create empty folder
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists
    When I click on "[data-cy=\"file-explorer-menu-create-folder\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists
    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "folder"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-folder\"]" appear 1 time on screen

    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-folder\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-folder\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists
    And  I expect "[data-cy=\"confirm-delete-checkbox\"]" not exists

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-folder\"]" not exists

  Scenario: Delete non-empty folder should display the checkox to confirm deletion of folder and its content (& keep selected tab open)
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I double click on "[data-cy=\"file-explorer-README.md\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"

    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists
    And  I expect "[data-cy=\"confirm-delete-checkbox\"]" exists
    And  I expect checkbox "[data-cy=\"confirm-delete-checkbox\"]" is not checked
    And  I expect "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]" to be disabled

    When I click on "[data-cy=\"confirm-delete-checkbox\"]"
    Then I expect checkbox "[data-cy=\"confirm-delete-checkbox\"]" is checked

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    #  Check elements to delete are deleted, and elements to keep are still present
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-label-terraform\"]" not exists
    And  I expect "[data-cy=\"file-label-app.tf\"]" not exists


  Scenario: Delete folder that contains opened files should remove all the corresponding tabs
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-app.tf\"]" exists

    When I double click on "[data-cy=\"file-explorer-app.tf\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "app.tf"

    #  Create "folder" inside "terraform" folder
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-folder\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "folder"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-folder\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-explorer-icon-folder\"].fa-folder" exists

    #  Create "file.js" inside "folder"
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-folder\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-folder\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "file.js"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-file.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "file.js"
    And  I expect "[data-cy=\"file-explorer-icon-folder\"].fa-folder-open" exists

    #  Delete "terraform" folder
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists
    And  I expect "[data-cy=\"confirm-delete-checkbox\"]" exists
    And  I expect checkbox "[data-cy=\"confirm-delete-checkbox\"]" is not checked
    And  I expect "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]" to be disabled

    When I click on "[data-cy=\"confirm-delete-checkbox\"]"
    Then I expect checkbox "[data-cy=\"confirm-delete-checkbox\"]" is checked

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    #  Check "folder", "app.tf" and "file.js" are deleted and all tab closed
    And  I expect "[data-cy=\"file-label-file.js\"]" not exists
    And  I expect "[data-cy=\"file-label-app.tf\"]" not exists
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 0 time on screen
    And  I expect "[data-cy=\"file-label-folder\"]" not exists

  Scenario: Delete folder that contains opened files should remove all the corresponding tabs and select another active tab
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I double click on "[data-cy=\"file-explorer-README.md\"]"
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-app.tf\"]" exists

    When I double click on "[data-cy=\"file-explorer-app.tf\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "app.tf"

    #  Create "folder" inside "terraform" folder
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-folder\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "folder"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-folder\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-explorer-icon-folder\"].fa-folder" exists

    #  Create "file.js" inside "folder"
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-folder\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-folder\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "file.js"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is created &#129395;!"

    And  I expect "[data-cy=\"create-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-file.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 3 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "file.js"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-explorer-icon-folder\"].fa-folder-open" exists

    #  Delete "terraform" folder
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists
    And  I expect "[data-cy=\"confirm-delete-checkbox\"]" exists
    And  I expect checkbox "[data-cy=\"confirm-delete-checkbox\"]" is not checked
    And  I expect "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]" to be disabled

    When I click on "[data-cy=\"confirm-delete-checkbox\"]"
    Then I expect checkbox "[data-cy=\"confirm-delete-checkbox\"]" is checked
    
    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    #  Check "folder", "app.tf" and "file.js" are deleted, related tabs closed and active tab is "README.md"
    And  I expect "[data-cy=\"file-label-file.js\"]" not exists
    And  I expect "[data-cy=\"file-label-app.tf\"]" not exists
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "README.md"
    And  I expect "[data-cy=\"file-label-folder\"]" not exists
