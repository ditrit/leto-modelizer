Feature: Test roundtrip of the application : rename project
  Scenario: Creating project then renaming it should only rename project root folder and keep created model and files
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'modelFolder' with 'model1'
    And   I visit the '/'
    And   I wait until the application is loaded

    # Create project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectTest'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is 'projectTest/models'

    # Create model
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is 'projectTest/modelizer/draw\?plugin=terrator-plugin&path={{ modelFolder }}'

    # Check project files and folders are created in Text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is 'projectTest/modelizer/text\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_projectTest"]' is 'projectTest'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_projectTest/{{ modelFolder }}"]' exists

    # Create file
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_projectTest"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_projectTest"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    And  I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'

    # Check project is displayed in home page
    When I visit the '/'
    And  I wait until the application is loaded
    Then I expect '[data-cy="project-card_projectTest"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_projectTest"] [data-cy="title-container"]' is 'projectTest'

    # Rename project and check old project name no longer exists
    When I click on '[data-cy="project-card_projectTest"] [data-cy="rename-button"]'
    And  I set on '[data-cy="rename-project-form"] [data-cy="name-input"]' text 'renamedProject'
    And  I click on '[data-cy="rename-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been renamed 😉'
    And  I expect '[data-cy="project-card_renamedProject"]' exists
    But  I expect '[data-cy="project-card_projectTest"]' not exists

    # Check project name is updated in Model view
    When I click on '[data-cy="project-card_renamedProject"]'
    And  I click on '[data-cy="diagram-path_{{ modelFolder }}"]'
    Then I expect current url is 'renamedProject/modelizer/draw\?plugin=terrator-plugin&path={{ modelFolder }}'

    # Check project name is updated in Text view
    When I wait 1 second
    And  I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is 'renamedProject/modelizer/text\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_renamedProject"]' is 'renamedProject'

    # Check model and files are still here
    And  I expect '[data-cy="file-explorer"] [data-cy="file_renamedProject/newFile.js"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_renamedProject/{{ modelFolder }}"]' exists

    # Check project name is displayed in home page
    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'
    And  I expect '[data-cy="project-card_renamedProject"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_renamedProject"] [data-cy="title-container"]' is 'renamedProject'
