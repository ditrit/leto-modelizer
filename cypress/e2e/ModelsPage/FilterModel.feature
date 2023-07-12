Feature: Test models page: diagram filter

  Scenario: Should filter diagrams by tags and search text
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'diagramName1' with 'diagramTerrator1'
    And   I set context field 'diagramName2' with 'diagramTerrator2'
    And   I set context field 'diagramName3' with 'diagramGithubator3'
    And   I set context field 'firstModelFile' with 'model1/main.tf'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I set context field 'secondModelFile' with 'model2/main.tf'
    And   I set context field 'secondModelFolder' with 'model2'
    And   I set context field 'thirdModel' with '.github/workflows/new_workflow.yml'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Diagram1 creation
    When I click on '[data-cy="create-model-button"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ firstModelFolder }}'

    # Return to project page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Diagram2 creation
    When I click on '[data-cy="create-model-button"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ secondModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ secondModelFolder }}'

    # Return to project page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Diagram3 creation
    When I click on '[data-cy="create-model-button"]'
    And  I select '[data-cy="item_githubator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=githubator-plugin&path={{ thirdModel }}'

    # Return to project page and verify all diagrams exist
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ thirdModel }}"]' exists

    # Filter by text and verify that some diagrams disappear
    When I set on '[data-cy="search-diagram-input"]' text '1'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' not exists
    And  I expect '[data-cy="diagram-path_{{ thirdModel }}"]' not exists

    # Clear filter text and verify all diagrams are present
    When I set on '[data-cy="search-diagram-input"]' text ' '
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ thirdModel }}"]' exists

    # Select Terraform tag and verify only all terraform diagrams are present
    When I select '[data-cy="select-checkbox_Infrastructure"]' in '[data-cy="diagram-tag-select"]'
    And  I click on '[data-cy="diagram-tag-select"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ thirdModel }}"]' not exists

    # Select Github tag and verify all diagrams are present
    When I select '[data-cy="select-checkbox_CI"]' in '[data-cy="diagram-tag-select"]'
    And  I click on '[data-cy="diagram-tag-select"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ thirdModel }}"]' exists

    # Unselect Terraform tag and verify only all githubator diagrams are present
    When I click on '[data-cy="chip_Infrastructure"] i[aria-label="Remove"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' not exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' not exists
    And  I expect '[data-cy="diagram-path_{{ thirdModel }}"]' exists

    # Unselect Github tag and verify all diagrams are present
    When I click on '[data-cy="chip_CI"] i[aria-label="Remove"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ thirdModel }}"]' exists
