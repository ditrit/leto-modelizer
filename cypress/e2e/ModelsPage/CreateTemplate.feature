Feature: Test models page: model creation from template

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelFile' with 'model/main.tf'
    And   I set context field 'modelFolder' with 'model'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

  Scenario: Create template model should redirect to draw page with correct plugin and create model folders
    # Model creation
    When I click on '[data-cy="add-model-button"]'
    Then I expect '[data-cy="create-diagram-drawer"]' exists
    And  I expect '[data-cy="template-card_terraform_webapp"]' exists

    When I click on '[data-cy="template-card_terraform_webapp"]'
    And  I click on '[data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-dialog"]' exists

    When I set on '[data-cy="import-model-template-form"] [data-cy="name-input"]' text 'model/'
    And  I click on '[data-cy="import-model-template-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'
    And  I wait 2 seconds

    # Go to text view and check files
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_leto-modelizer.config.json"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ modelFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ modelFile }}"]' exists
    And  I expect '[data-cy="active-tab"] [data-cy="file_{{ modelFile }}"]' exists
    And  I expect active file content to be equal to "cypress/resources/main.tf"

    When I double click on '[data-cy="file-explorer"] [data-cy="file_leto-modelizer.config.json"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_leto-modelizer.config.json"]' exists
    And  I expect active file content to contain 'model.*terrator-plugin.*aws_1.*nginx'
    And  I expect active file content to be equal to "cypress/resources/leto-modelizer.config.txt"

  Scenario: Create two template models with same parameters should not be possible
    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ modelFolder }}'

    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-path_{{ modelFolder }}"]' exists

    # Create same model and check error
    When I click on '[data-cy="add-model-button"]'
    Then I expect '[data-cy="create-diagram-drawer"]' exists
    And  I expect '[data-cy="template-card_terraform_webapp"]' exists

    When I click on '[data-cy="template-card_terraform_webapp"]'
    And  I click on '[data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-dialog"]' exists

    When I set on '[data-cy="import-model-template-form"] [data-cy="name-input"]' text '{{ modelFile }}'
    And  I click on '[data-cy="import-model-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-form"] [role="alert"]' is "Model name already exists for this plugin."
