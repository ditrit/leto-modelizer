Feature: Test diagrams page: display all diagrams

  Scenario: Should display all diagrams
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I set context field 'secondModelFolder' with 'model2'

    # Project creation
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projects/{{ projectName }}/models'

    # First model creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 2 seconds
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ firstModelFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform'

    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    Then I expect '.id_1.component' exists

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists

    # Second model creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ secondModelFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 2 seconds
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ secondModelFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform'

    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    Then I expect '.id_1.component' exists

    # Back to the models page
    When I visit the '/projects/{{ projectName }}/diagrams'
    And  I wait until the application is loaded
    Then I expect '[data-cy="diagram_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram_{{ secondModelFolder }}"]' exists
