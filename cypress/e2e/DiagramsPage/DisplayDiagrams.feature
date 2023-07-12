Feature: Test diagrams page: display all diagrams

  Scenario: Should display all diagrams
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'firstModelFile' with 'model1/main.tf'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I set context field 'secondModelFile' with 'model2/main.tf'
    And   I set context field 'secondModelFolder' with 'model2'

    # Project creation
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projects/{{ projectName }}/models'

    # First model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 2 seconds
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ firstModelFolder }}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    Then I expect '[data-cy="draw-container"]' exists
    And  I expect '[id^="aws"]' exists

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists

    # Second model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ secondModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ secondModelFolder }}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    Then I expect '[data-cy="draw-container"]' exists
    And  I expect '[id^="aws"]' exists

    # Back to the models page
    When I visit the 'localhost:8080/#/projects/{{ projectName }}/diagrams'
    Then I expect '[data-cy="diagram_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram_{{ secondModelFolder }}"]' exists
