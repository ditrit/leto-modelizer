Feature: Test modelizer text view: switch model file

  Scenario: Select the file of another model should update url
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I set context field 'firstModelFile' with 'model1/main.tf'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I set context field 'secondModelFile' with 'model2/main.tf'
    And   I set context field 'secondModelFolder' with 'model2'
    And   I visit the '/'
    And   I wait until the application is loaded

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

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ firstModelFolder }}'

    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Another model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ secondModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ secondModelFolder }}'

    # Go to text view and check folders
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ secondModelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ secondModelFolder }}"]' exists

    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ firstModelFolder }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ firstModelFolder }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    And  I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile.tf'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ firstModelFile }}"]' exists
    And  I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ firstModelFolder }}'

  Scenario: Select not parsable file should not update url
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I set context field 'modelFile' with 'model1/main.tf'
    And   I set context field 'modelFolder' with 'model1'
    And   I visit the '/'
    And   I wait until the application is loaded

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

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ modelFolder }}'

    # Go to text view and check folders
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And I wait 2 seconds
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ modelFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_README.md"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'main.tf'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ modelFolder }}'
