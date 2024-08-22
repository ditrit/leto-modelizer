Feature: Test models page: switch from table to grid display type

  Scenario: Click on grid button should display diagram grid and disable the grid button
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelFile' with 'model1/main.tf'
    And   I set context field 'modelFolder' with 'model1'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ modelFolder }}'

    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'

    And  I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-grid"]' not exists
    And  I expect '[data-cy="diagram-grid-button"]' exists
    And  I expect '[data-cy="diagram-table-button"]' to be disabled

    When I click on '[data-cy="diagram-grid-button"]'
    Then I expect '[data-cy="diagram-grid-button"]' to be disabled
    And  I expect '[data-cy="diagram-grid"]' exists
    But  I expect '[data-cy="diagram-table"]' not exists
