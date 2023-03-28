Feature: Test models page: model creation from template

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelName' with 'modelTest'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{projectName}}/models'

  Scenario: Create template model should redirect to draw page with correct plugin and create model folders
    # Model creation
    When I click on '[data-cy="template-card_terraform_webapp"]'
    And  I set on '[data-cy="import-model-template-form"] [data-cy="name-input"]' text '{{modelName}}'
    And  I click on '[data-cy="import-model-template-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{projectName}}/modelizer/draw\?path=terrator-plugin/{{modelName}}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'
    And  I wait 2 seconds

    # Go to text view and check files
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{projectName}}/modelizer/text\?path=terrator-plugin/{{modelName}}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{projectName}}"]' is '{{projectName}}'
    And  I wait 2 seconds

    When I click on '[data-cy="file-explorer"] [data-cy="folder_{{projectName}}"]'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/{{modelName}}"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/{{modelName}}"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/{{modelName}}/main.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/{{modelName}}/main.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="active-tab"] [data-cy="file_terrator-plugin/{{modelName}}/main.tf"]' exists
    And  I expect active file content to be equal to "cypress/resources/main.tf"

  Scenario: Create two template models with same parameters should not be possible
    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{modelName}}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{projectName}}/modelizer/draw\?path=terrator-plugin/{{modelName}}'

    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{projectName}}/models'
    And  I expect '[data-cy="model-card_terrator-plugin-{{modelName}}"]' exists

    # Create same model and check error
    When I click on '[data-cy="template-card_terraform_webapp"]'
    And  I set on '[data-cy="import-model-template-form"] [data-cy="name-input"]' text '{{modelName}}'
    And  I click on '[data-cy="import-model-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-form"] [role="alert"]' is "Model name already exists for this plugin."

  Scenario: Try to create template model without name should not be possible
    When I click on '[data-cy="template-card_terraform_webapp"]'
    And  I click on '[data-cy="import-model-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-form"] [role="alert"]' is 'Please type something'
