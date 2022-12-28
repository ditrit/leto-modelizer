Feature: Test modelizer text view: add file

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

  Scenario: An unmodified file should not have the "add" action inside file explorer menu
    When I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-label-{{ projectName }}\"]"
    And  I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-README.md\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-README.md\"]"
    Then I expect "[data-cy=\"file-label-README.md\"].file-status-unmodified" exists
    And  I expect "[data-cy=\"file-explorer-action-menu\"]" exists
    But  I expect "[data-cy=\"file-explorer-menu-add-file\"]" not exists

  Scenario: Create a file inside the root folder and add it on git should change the file's status
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-{{ projectName }}\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-create-file\"]"
    Then I expect "[data-cy=\"create-file-dialog\"]" exists

    When I set on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-input\"]" text "newFile.js"
    And  I click on "[data-cy=\"create-file-form\"] [data-cy=\"create-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is created &#129395;!"
    And  I expect "[data-cy=\"create-file-form\"]" is closed
    And  I expect ".file-status-untracked" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-newFile.js\"].file-status-untracked" exists
 
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-add-file\"]"
    Then I expect "positive" toast to appear with text "File is added &#129395;!"
    And  I expect "[data-cy=\"file-label-newFile.js\"].file-status-staged" exists

  Scenario: Create a file inside sub-folder and add it on git should change the file's status
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
    And  I expect ".file-status-untracked" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-newFile.js\"].file-status-untracked" exists
 
    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-newFile.js\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-add-file\"]"
    Then I expect "positive" toast to appear with text "File is added &#129395;!"
    And  I expect "[data-cy=\"file-label-newFile.js\"].file-status-staged" exists
    
