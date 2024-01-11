Feature: Fix issue #474: Delete last component of model file, the file is deleted and model is no longer displayed in the list

  Scenario: Delete last component of model file should not delete the model
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    # Project creation
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path='

    # Click on component
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_server"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="draw-container"]' exists
    And  I wait 1 second
    And  I expect '[id^="id_1"]' exists

    # Check project folders and files are created in Text view
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is 'projectName/modelizer/text\?plugin=terrator-plugin&path='
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_projectName"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/new_file.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/README.md"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    # Go to Draw view and delete component
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path='

    When I click on '[data-cy="draw-container"] [id^="id_1"]'
    And  I wait 1 second
    Then I expect '[id^="remove-component"]' exists

    When I force click on '[id^="remove-component"]'
    And  I wait 1 second
    Then I expect '[data-cy="draw-container"] [id^="id_1"]' not exists

    # Go to Text view and check default file exists
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is 'projectName/modelizer/text\?plugin=terrator-plugin&path='
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_projectName"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/new_file.tf"]' exists

    # Check model is still displayed in the list
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-path_"]' exists
