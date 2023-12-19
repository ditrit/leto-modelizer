Feature: Fix issue #392: Delete diagram should only remove parsable files of diagrams

  Scenario: Delete diagram should remove it from storage
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded
    And   I set context field 'projectName' with 'projectName'

    # Project creation
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Diagram 1 creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'diag1'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=diag1'

    # Diagram 2 creation
    When I click on '[data-cy="models-page-link-button"]'
    And  I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'diag1/diag2'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=diag1/diag2'

    # Check project folders and files are created in Text view
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=diag1/diag2'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/diag1"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/diag1/new_file.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/diag1/diag2"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/diag1/diag2/new_file.tf"]' exists

    # Create non parsable file inside diag1 folder
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/diag1"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/diag1"]'
    And  I click on '[data-cy="create-file-action-item"]'
    And  I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'file1.txt'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/diag1/file1.txt"]' exists

    # Go to models pages and check diagrams are displayed
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-path_diag1"]' exists
    And  I expect '[data-cy="diagram-path_diag1/diag2"]' exists

    # Delete diag1 diagram
    ## Should delete it from the diagram list but keep diag1/diag2 subfolder
    When I click on '[data-cy="diagram-actions_diag1"]'
    And  I click on '[data-cy="delete-diagram-action-item"]'
    And  I click on '[data-cy="delete-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="diagram-path_diag1"]' not exists
    But  I expect '[data-cy="diagram-path_diag1/diag2"]' exists

    ## Should delete new_file.tf file but keep all non parsable files and sub-folder
    When I click on '[data-cy="diagram-path_diag1/diag2"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=diag1/diag2'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=diag1/diag2'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/diag1"]' exists
    But  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/diag1/new_file.tf"]' not exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/diag1/file1.txt"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/diag1/diag2"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/diag1/diag2/new_file.tf"]' exists
