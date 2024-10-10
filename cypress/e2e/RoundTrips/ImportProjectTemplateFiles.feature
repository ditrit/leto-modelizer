Feature: Test roundtrip of the application : import project with template files

  Scenario: Import project with a template redirect to models page with template models and create project files and folders
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'modelFile' with 'model1/main.tf'
    And   I set context field 'modelFolder' with 'model1'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I visit the '/'
    And   I wait until the application is loaded

    # Import project with a template and check template models are displayed
    Then I expect '[data-cy="template-card_Project template"]' exists

    When I click on '[data-cy="template-card_Project template"]'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="import-project-checkbox"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ projectName }}/models'
    And  I expect '[data-cy="diagram-path_infra/dev"]' appear 1 time on screen
    And  I expect '[data-cy="diagram-path_infra/prod"]' appear 1 time on screen

    When I click on '[data-cy="diagram-path_infra/prod"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path=infra/prod'
    And  I wait 1 second

    # Check project files and folders are created in Text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=@ditrit/terrator-plugin&path=infra/prod'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'

    When I wait 2 seconds
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/terraform"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/branch.txt"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/infra/prod"]' exists

    # Check content of imported project files
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/README.md"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_{{ projectName }}/README.md"]' exists
    And  I expect active file content to be equal to 'cypress/resources/project-test/README.md'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/branch.txt"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_{{ projectName }}/branch.txt"]' exists
    And  I expect active file content to contain 'main'

    When I click on '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/terraform"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/terraform/app.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/terraform/app.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_{{ projectName }}/terraform/app.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/project-test/app.tf'

    # Check content of plugin and template files
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/infra/dev"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/infra/prod"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/infra/prod/main.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/infra/prod/main.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_{{ projectName }}/infra/prod/main.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra/prod/main.tf'

    When I click on '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/infra/dev"]'
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/infra/dev/main.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_{{ projectName }}/infra/dev/main.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra/dev/main.tf'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/infra/dev/provider.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_{{ projectName }}/infra/dev/provider.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra/dev/provider.tf'

    # Check project is displayed in home page
    When I visit the '/'
    And  I wait until the application is loaded
    Then I expect '[data-cy="project-card_{{ projectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ projectName }}"] [data-cy="title-container"]' is '{{ projectName }}'
