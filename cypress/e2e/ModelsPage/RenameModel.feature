Feature: Test models page: rename model

  Scenario: Rename model and verify the new name
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelFile' with 'model1/main.tf'
    And   I set context field 'modelFolder' with 'model1'
    And   I set context field 'newModelFolder' with 'model2'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    And  I click on '[data-cy="create-model-button"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-path_{{ modelFolder }}"]' exists
    And  I expect '[data-cy="diagram-actions_{{ modelFolder }}"]' exists

    # Rename model
    When I click on '[data-cy="diagram-actions_{{ modelFolder }}"]'
    Then I expect '[data-cy="diagrams-table-action-menu"]' exists

    When I click on '[data-cy="diagrams-table-action-menu"] [data-cy="rename-diagram-action-item"]'
    Then I expect '[data-cy="rename-model-dialog"]' exists
    And  I expect field '[data-cy="rename-model-form"] [data-cy="name-input"]' is '{{ modelFolder }}'

    When I set on '[data-cy="rename-model-form"] [data-cy="name-input"]' text '{{ newModelFolder }}'
    And  I click on '[data-cy="rename-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="diagram-path_{{ newModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ modelFolder }}"]' not exists

    # Click on model and go to text view and check files
    When I click on '[data-cy="diagram-path_{{ newModelFolder }}"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ newModelFolder }}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ newModelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ newModelFolder }}"]' exists
