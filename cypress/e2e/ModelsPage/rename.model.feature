Feature: Test models page: rename model

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelName' with 'modelTest'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    And  I click on '[data-cy="create-model-button"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{modelName}}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{projectName}}/models'
    And  I expect '[data-cy="model-card_terrator-plugin-{{modelName}}"] [data-cy="rename-button"]' exists

  Scenario: Rename model and verify the new name
    # Rename model
    When I click on '[data-cy="model-card_terrator-plugin-{{modelName}}"] [data-cy="rename-button"]'
    Then I expect field '[data-cy="rename-model-form"] [data-cy="name-input"]' is '{{modelName}}'

    Given I set context field 'modelName' with 'newModelTest'

    When I set on '[data-cy="rename-model-form"] [data-cy="name-input"]' text '{{modelName}}'
    And  I click on '[data-cy="rename-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="model-card_terrator-plugin-{{modelName}}"]' exists

    # Click on model and go to text view and check files
    When I click on '[data-cy="model-card_terrator-plugin-{{modelName}}"]'
    Then I expect current url is '{{projectName}}/modelizer/draw\?path=terrator-plugin/{{modelName}}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{projectName}}/modelizer/text\?path=terrator-plugin/{{modelName}}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{projectName}}"]' is '{{projectName}}'

    When I click on '[data-cy="file-explorer"] [data-cy="folder_{{projectName}}"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/{{modelName}}"]' exists
