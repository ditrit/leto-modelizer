Feature: Test roundtrip of the application : import project with template files

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'modelName' with 'modelTest'
    And   I set context field 'projectName' with 'leto-modelizer-project-test'
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I visit the '/'

  Scenario: Import project with a template redirect to models page with template models and create project files and folders
    # Import project with a template and check template models are displayed
    Then I expect '[data-cy="template-card_project_template"]' exists

    When I click on '[data-cy="template-card_project_template"]'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="import-project-checkbox"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{projectName}}/models'
    And  I expect '[data-cy="model-card_terrator-plugin-infra1"]' appear 1 time on screen
    And  I expect '[data-cy="model-card_terrator-plugin-infra2"]' appear 1 time on screen

    When I click on '[data-cy="model-card_terrator-plugin-infra2"]'
    Then I expect current url is '{{projectName}}/modelizer/draw\?path=terrator-plugin/infra2'

    # Check project files and folders are created in Text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{projectName}}/modelizer/text\?path=terrator-plugin/infra2'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{projectName}}"]' is '{{projectName}}'

    When I wait 2 seconds
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_{{projectName}}"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_terraform"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_branch.txt"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_README.md"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_leto-modelizer-plugin-test"]' exists

    # Check content of imported project files
    When I double click on '[data-cy="file-explorer"] [data-cy="file_README.md"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_README.md"]' exists
    And  I expect active file content to be equal to 'cypress/resources/project-test/README.md'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_branch.txt"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_branch.txt"]' exists
    And  I expect active file content to contain 'main'

    When I click on '[data-cy="file-explorer"] [data-cy="folder_terraform"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_terraform/app.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_terraform/app.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_terraform/app.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/project-test/app.tf'

    # Check content of plugin and template files
    When I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/infra1"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/infra2"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/infra2"]'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/infra2/main.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/infra2/main.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_terrator-plugin/infra2/main.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra2/main.tf'

    When I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/infra1"]'
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/infra1/main.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_terrator-plugin/infra1/main.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra1/main.tf'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/infra1/provider.tf"]'
    Then I expect '[data-cy="active-tab"] [data-cy="file_terrator-plugin/infra1/provider.tf"]' exists
    And  I expect active file content to be equal to 'cypress/resources/infra1/provider.tf'

    When I click on '[data-cy="file-explorer"] [data-cy="folder_leto-modelizer-plugin-test"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_leto-modelizer-plugin-test/test1"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_leto-modelizer-plugin-test/test1"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_leto-modelizer-plugin-test/test1/default.plugin-test.js"]' exists

    # Check project is displayed in home page
    When I visit the '/'
    Then I expect '[data-cy="project-card_{{projectName}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{projectName}}"] [data-cy="title-container"]' is '{{projectName}}'
