Feature: Test roundtrip of the application : create project with template files

  Scenario: Create project from a template redirect to models page with template models and create project files and folders
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'projectTest'
    And   I visit the '/'

    # Create project from a template and check template models are displayed
    When I wait 1 second
    Then I expect '[data-cy="template-card_project_template"]' exists

    When I click on '[data-cy="template-card_project_template"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-path_infra/dev"]' appear 1 time on screen
    And  I expect '[data-cy="diagram-path_infra/prod"]' appear 1 time on screen

    When I click on '[data-cy="diagram-path_infra/prod"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path=infra/prod'

    # Check project files and folders are created in Text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=infra/prod'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_infra/prod"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_infra/dev"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_infra/prod/main.tf"]' exists
    And  I expect '[data-cy="active-tab"] [data-cy="file_infra/prod/main.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra/prod/main.tf'

    When I click on '[data-cy="file-explorer"] [data-cy="folder_infra/dev"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_infra/dev/main.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_infra/dev/provider.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_infra/dev/main.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_infra/dev/main.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra/dev/main.tf'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_infra/dev/provider.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_infra/dev/provider.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra/dev/provider.tf'

    # Check project is displayed in home page
    When I visit the '/'
    Then I expect '[data-cy="project-card_{{ projectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ projectName }}"] [data-cy="title-container"]' is '{{ projectName }}'
