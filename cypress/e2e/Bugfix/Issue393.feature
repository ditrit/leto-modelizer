Feature: Fix issue #393: File explorer is broken when creating a folder with the same name as the root folder

  Scenario: File explorer can display a folder with the same name as the root folder
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    # Project creation
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Diagram creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=@ditrit/terrator-plugin&path='

    # Check project folders and files are created in Text view
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is 'projectName/modelizer/text\?plugin=@ditrit/terrator-plugin&path='
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_projectName"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/new_file.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/README.md"]' exists

    # Create "projectName" sub-folder in Text view and check folders and files still exist
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_projectName"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_projectName"]'
    And  I click on '[data-cy="create-folder-action-item"]'
    And  I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_projectName/projectName"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/new_file.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/README.md"]' exists
