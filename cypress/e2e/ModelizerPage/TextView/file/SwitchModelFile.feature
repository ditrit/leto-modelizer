Feature: Test modelizer text view: switch model file

  Scenario: Select the file of another model should update url
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I set context field 'pluginName' with 'terrator-plugin'
    And   I set context field 'modelName' with 'modelName'
    And   I set context field 'model2Name' with 'model2Name'
    And   I visit the '/'

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
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '{{ pluginName }}'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelName }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?path={{ pluginName }}/{{ modelName }}'

    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Another model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '{{ pluginName }}'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ model2Name }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?path={{ pluginName }}/{{ model2Name }}'

    # Go to text view and check folders
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?path={{ pluginName }}/{{ model2Name }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ pluginName }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ pluginName }}/{{ modelName }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ pluginName }}/{{ model2Name }}"]' exists

    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ pluginName }}/{{ modelName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ pluginName }}/{{ modelName }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    And  I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ pluginName }}/{{ modelName }}/newFile"]' exists
    And  I expect current url is '{{ projectName }}/modelizer/text\?path={{ pluginName }}/{{ modelName }}'
