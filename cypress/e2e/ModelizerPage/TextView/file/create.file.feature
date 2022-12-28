Feature: Test modelizer text view: create file and folder

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

  Scenario: Create a file inside the root folder should expand the root folder and open corresponding active tab
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "newFile.js"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    #  New active tab is open with created file's label
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "newFile.js"
    #  Created file is added inside file explorer and file tabs
    And  I expect "[data-cy=\"file-label-newFile.js\"]" appear 2 times on screen
    #  Created file's label is red
    And  I expect ".file-status-untracked" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-newFile.js\"].file-status-untracked" exists
    #  Root folder is expanded
    And  I expect "[data-cy=\"file-explorer-icon-{{ projectName }}\"].fa-folder-open" exists

  Scenario: Create a file inside sub-folder should open corresponding active tab and expand the parent folder
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "newFile.js"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    #  New tab is open with created file's label
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 1 time on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "newFile.js"
    #  Created file is added inside file explorer and file tabs
    And  I expect "[data-cy=\"file-label-newFile.js\"]" appear 2 times on screen
    #  Created file's label is red
    And  I expect ".file-status-untracked" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-newFile.js\"].file-status-untracked" exists
    #  Parent folder is expanded
    And  I expect "[data-cy=\"file-explorer-icon-terraform\"].fa-folder-open" exists
  
  Scenario: Create a folder inside the root folder should expand root folder
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-folder\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "newFolder"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    #  No tab open
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 0 time on screen
    #  Created folder is added inside file explorer
    And  I expect "[data-cy=\"file-label-newFolder\"]" appear 1 time on screen
    #  Root folder is expanded, created folder is not expanded
    And  I expect "[data-cy=\"file-explorer-icon-{{ projectName }}\"].fa-folder-open" exists
    And  I expect "[data-cy=\"file-explorer-icon-newFolder\"].fa-folder" exists

  Scenario: Create a folder inside folder should expand parent folder
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-terraform\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-folder\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "newFolder"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "Folder is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    #  No tab open
    And  I expect "[data-cy=\"file-tabs-container\"] [role=\"tab\"]" appear 0 time on screen
    #  Created folder is added inside file explorer
    And  I expect "[data-cy=\"file-label-newFolder\"]" appear 1 time on screen
    #  Root and parent folder are expanded, created folder is not expanded
    And  I expect "[data-cy=\"file-explorer-icon-{{ projectName }}\"].fa-folder-open" exists
    And  I expect "[data-cy=\"file-explorer-icon-terraform\"].fa-folder-open" exists
    And  I expect "[data-cy=\"file-explorer-icon-newFolder\"].fa-folder" exists
