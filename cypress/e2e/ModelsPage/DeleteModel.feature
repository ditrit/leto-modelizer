Feature: Test models page: model deletion

  Scenario: Delete model, create another model to check previous model files are deleted
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'firstModelFile' with 'model1/main.tf'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I set context field 'secondModelFile' with 'model2/main.tf'
    And   I set context field 'secondModelFolder' with 'model2'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

  #  When I click on '[data-cy="create-model-button"]'
  #  Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ firstModelFolder }}'

    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-actions_{{ firstModelFolder }}"]' exists

    # Delete model
    When I click on '[data-cy="diagram-actions_{{ firstModelFolder }}"]'
    Then I expect '[data-cy="diagrams-table-action-menu"]' exists

  #  When I click on '[data-cy="diagrams-table-action-menu"] [data-cy="delete-diagram-action-item"]'
  #  Then I expect '[data-cy="delete-model-dialog"]' exists

    When I click on '[data-cy="delete-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' not exists

  #  # Second model creation
  #  When I click on '[data-cy="create-model-button"]'
  #  Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ secondModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ secondModelFolder }}'

    # Go to text view and check files of first model doesn't exists
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ secondModelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ secondModelFolder }}"]' exists
