Feature: Test modelizer text view: update file's content

  Background:
    Given I clear cache
    And I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And I set context field "projectName" with "leto-modelizer-project-test"
    And I visit the "/"

    When I click on '[data-cy="import-project"]'
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
    And  I wait 1 second

  Scenario: Check if the file's content is set after being updated
    Given I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'
    When I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-label-branch.txt"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect active file content to contain "main"

    When I set active file content to "updated content"
    Then I expect active file content to contain "updated.*content"

  Scenario: Check if the file updated content is still set after switching tab
    Given I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'
    When I double click on '[data-cy="file-explorer-README.md"]'
    And  I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-label-branch.txt"]' appear 2 times on screen
    And  I expect '[data-cy="file-label-README.md"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is "README.md"
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect active file content to contain "main"

    When I set active file content to "updated content"
    Then I expect active file content to contain "updated.*content"

    When I click on '[data-cy="file-tabs-container"] [data-cy="file-label-README.md"]'
    And  I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file-label-branch.txt"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect active file content to contain "updated.*content"

  Scenario: Open a file in root folder and update its content should change the file's class
    When I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'
    And  I double click on '[data-cy="file-explorer-branch.txt"]'
    Then I expect '[data-cy="file-label-branch.txt"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "branch.txt"
    And  I expect '[data-cy="file-label-branch.txt"].file-status-unmodified' exists
    And  I expect active file content to contain "main"

    When I set active file content to "updated content"
    Then I expect active file content to contain "updated.*content"
    And  I expect '[data-cy="file-label-branch.txt"].file-status-modified' exists

  Scenario: Open a file in sub-folder and update its content should change the file's class
    When I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="file-label-terraform"]'
    And  I double click on '[data-cy="file-explorer-app.tf"]'
    Then I expect '[data-cy="file-label-app.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is "app.tf"
    And  I expect '[data-cy="file-label-app.tf"].file-status-unmodified' exists
    And  I expect active file content to contain "main"

    When I set active file content to "updated content"
    Then I expect '[data-cy="file-label-app.tf"].file-status-modified' exists
    And  I expect active file content to contain "updated.*content"

  Scenario: Update a file's content should make the "add" action available inside file explorer menu
    When I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'
    And  I hover '[data-cy="file-explorer"] [data-cy="file-explorer-buttons-branch.txt"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-explorer-buttons-branch.txt"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists
    And  I expect '[data-cy="file-explorer-menu-add-file"]' not exists
    And  I expect '[data-cy="file-label-branch.txt"].file-status-unmodified' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file-label-branch.txt"]'
    Then I expect active file content to contain "main"

    When I set active file content to "updated content"
    And  I click on '[data-cy="file-explorer"] [data-cy="file-explorer-buttons-branch.txt"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-explorer-action-menu"]' exists
    And  I expect '[data-cy="file-explorer-menu-add-file"]' exists
    And  I expect '[data-cy="file-label-branch.txt"].file-status-modified' exists
    And  I expect active file content to contain "updated.*content"
