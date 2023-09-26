Feature: Test roundtrip of the application: project creation via template

  ################## CreateProject.feature ##################
  ## 100 Home page should display one template project card
  ## 101 Creating a project from a template with an empty name should display an error
  ## 102 Create initial project from a template
  ## 103 Created template project should redirect to models page and send positive toast
  ## 104 After creation of template project, verify its diagrams exist
  ## 105 Created template project should be in the projects list
  ## 106 Created template project should be in the left drawer
  ## 107 Create template project with an already existing project name should display an error

  ################## Filter project templates ##################
  ## 200 Set 'template' as searched text and expect only templates that contains 'template' to be displayed
  ## 201 Set 'none' as searched text and expect no template is displayed and empty message appears
  ## 202 Unset searched text and expect all templates are displayed

  ################## FilterTemplate.feature ##################
  ## 300 Filter diagram templates by plugins and search text

  ################## CreateTemplate.feature ##################
  # Diagram creation from template
  ## 400 Add diagram template should redirect to draw page with correct plugin
  ## 401 Add diagram template should create diagram folders
  ## 402 Add diagram template with an already existing name should display an error
  ## 403 After creation of template diagrams, verify they are displayed in the multi-diagrams view

  Scenario: Roundtrip about project & diagram templates

    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'localTemplateProjectTest'
    And   I set context field 'diagramFolder' with 'diagram'
    And   I set context field 'diagramFile' with 'diagram/main.tf'
    And   I visit the '/'
    And   I wait until the application is loaded

    ## 100 Home page should display one template project card
    And  I expect '[data-cy="template-card_project_template"]' exists
    And  I expect '[data-cy="template-card_project_template"] [data-cy="title-container"]' is 'Project template'

    ## 101 Creating a project from a template with an empty name should display an error
    When I click on '[data-cy="template-card_project_template"]'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-template-form"] [role="alert"]' is 'Please type something'
    When I click on '[data-cy="close-dialog-button"]'

    ## 102 Create initial project from a template
    And  I click on '[data-cy="template-card_project_template"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'

    ## 103 Created template project should redirect to models page and send positive toast
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ projectName }}/models'

    ## 104 After creation of template project, verify its diagrams and files exist
    And  I expect '[data-cy="diagram-table"] [data-cy="diagram-path_infra/dev"]' exists
    And  I expect '[data-cy="diagram-table"] [data-cy="diagram-path_infra/prod"]' exists
    And  I expect '[data-cy="diagram-table"] [data-cy="diagram-path_.github/workflows/CI.yml"]' exists

    When I click on '[data-cy="diagram-table"] [data-cy="diagram-path_infra/dev"]'
    And  I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path=infra/dev'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_infra/dev/main.tf"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_infra/dev/provider.tf"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_infra/prod"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_infra/prod/main.tf"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_.github"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_.github/workflows"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_.github/workflows/CI.yml"]' exists

    # Back to models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'

    ## 105 Created template project should be in the projects list
    When I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect '[data-cy="project-card_{{ projectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ projectName }}"] [data-cy="title-container"]' is '{{ projectName }}'

    ## 106 Created template project should be in the left drawer
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ projectName }}"]' exists
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ projectName }}"]' is '{{ projectName }}'

    ## 107 Create template project with an already existing project name should display an error
    When I click on '[data-cy="template-card_project_template"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-template-form"] [role="alert"]' is 'Project name already exists.'

    # Close dialog
    When I click on '[data-cy="close-dialog-button"]'

    ## 200 Set 'template' as searched text and expect only templates that contains 'template' to be displayed
    And  I set on '[data-cy="search-template-project-input"]' text 'template'
    Then I expect '[data-cy="template-card_project_template"]' appear 1 time on screen

    ## 201 Set 'none' as searched text and expect no template is displayed and empty message appears
    When I set on '[data-cy="search-template-project-input"]' text 'none'
    Then I expect '[data-cy="template-card_project_template"]' not exists
    And  I expect '[data-cy="template-project-grid-empty"]' exists
    And  I expect '[data-cy="template-project-grid-empty"]' is 'No template available'

    ## 202 Unset searched text and expect all templates are displayed
    # For now, only one project template exists
    When I set on '[data-cy="search-template-project-input"]' text ' '
    Then I expect '[data-cy="template-card_project_template"]' exists

    ## 300 Filter diagram templates by plugins and search text
    # Open drawer and verify all templates are present
    When I click on '[data-cy="project-card_{{ projectName }}"]'
    And  I click on '[data-cy="add-model-button"]'
    Then I expect '[data-cy="template-card_terraform_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_github_CI"]' appear 1 time on screen

    # Set 'java' as searched text and expect only templates that contains 'java' to be displayed
    When I set on '[data-cy="search-template-input"]' text 'java'
    Then I expect '[data-cy="template-card_terraform_webapp"]' not exists
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_github_CI"]' not exists

    # Clear filter text and verify all templates are present
    When I set on '[data-cy="search-template-input"]' text ' '
    Then I expect '[data-cy="template-card_terraform_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_github_CI"]' appear 1 time on screen

    # Select Githubator-plugin plugin and verify only GitHub-action templates are present
    When I select '[data-cy="item_Github"]' in '[data-cy="language-select"]'
    Then I expect '[data-cy="template-card_terraform_webapp"]' not exists
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' not exists
    And  I expect '[data-cy="template-card_github_CI"]' appear 1 time on screen

    # Select Terrator-plugin plugin and verify only terraform templates are present
    When I select '[data-cy="item_Terraform"]' in '[data-cy="language-select"]'
    Then I expect '[data-cy="template-card_terraform_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_github_CI"]' not exists

    ## 400 Add diagram template should redirect to draw page with correct plugin
    When I click on '[data-cy="template-card_terraform_webapp"]'
    And  I click on '[data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-dialog"]' exists

    When I set on '[data-cy="import-model-template-form"] [data-cy="name-input"]' text '{{ diagramFolder }}/'
    And  I click on '[data-cy="import-model-template-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ diagramFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    ## 401 Add diagram template should create diagram folders
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ diagramFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ diagramFolder }}"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ diagramFile }}"]' exists
    And  I expect '[data-cy="active-tab"] [data-cy="file_{{ diagramFile }}"]' exists
    And  I expect active file content to be equal to "cypress/resources/main.tf"

    # Back to models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ projectName }}/models'

    ## 402 Add diagram template with an already existing name should display an error
    When I click on '[data-cy="add-model-button"]'
    Then I expect '[data-cy="create-diagram-drawer"]' exists
    And  I expect '[data-cy="template-card_terraform_webapp"]' exists

    When I click on '[data-cy="template-card_terraform_webapp"]'
    And  I click on '[data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-dialog"]' exists

    When I set on '[data-cy="import-model-template-form"] [data-cy="name-input"]' text '{{ diagramFolder }}/'
    And  I click on '[data-cy="import-model-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="import-model-template-form"] [role="alert"]' is "Model name already exists for this plugin."

    # Close dialog
    When I click on '[data-cy="import-model-template-dialog"] [data-cy="close-dialog-button"]'

    ## 403 After creation of template diagram, verify it is displayed in the multi-diagrams view
    And  I visit the 'localhost:8080/#/projects/{{ projectName }}/diagrams'
    And  I wait until the application is loaded
    Then I expect '[data-cy="diagrams-page"] [data-cy="diagram-card_{{ diagramFolder }}"]' exists
    # Check project template diagrams are displayed too
    And  I expect '[data-cy="diagrams-page"] [data-cy="diagram-card_infra/dev"]' exists
    And  I expect '[data-cy="diagrams-page"] [data-cy="diagram-card_infra/prod"]' exists
    And  I expect '[data-cy="diagrams-page"] [data-cy="diagram-card_.github/workflows/CI.yml"]' exists
