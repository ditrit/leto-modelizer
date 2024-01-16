Feature: Test diagrams page: diagram creation

  Scenario: Create model on diagrams page should redirect to draw page with correct plugin and create model folders
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelFolder' with 'infra'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Go to the diagrams page
    When I visit the '/projects/{{ projectName }}/diagrams'
    And  I wait until the application is loaded

    # Model creation
    Then I expect '[data-cy="create-model-button"]' exists
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    # Go to text view and check files
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ modelFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ modelFolder }}/new_file.tf"]' exists
