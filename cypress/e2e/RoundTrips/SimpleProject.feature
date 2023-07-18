Feature: Test home page: project creation

  ################## CreateProject.feature ##################
  ## 100 Home page should display an empty project message and one template project card
  ## 101 Creating project with empty name should display an error
  ## 102 Create intial project
  ## 103 Created project should redirect to models page and send positive toast
  ## 104 Created project should be in the projects list
  ## 105 Created project should be in the left drawer
  ## 106 Create project with an already existing project name should display an error

  ################## RenameProject.feature ##################
  ## 200 Renaming existing project should update the project name in the projects list
  ## 201 Renaming existing project should update the project name in the left drawer

  ################## DeleteProject.feature ##################
  ## 300 Delete project should remove it from the projects list
  ## 301 Delete project should remove it from the left drawer

  ################## FilterProject.feature ##################
  ## 400 Verify all project tags are inactive
  ## 401 Select local tag and verify only local projects are displayed
  ## 402 Select the remote tag and check that no project is present
  ## 403 Unselect local tag and verify only remote projects are displayed
  ## 404 Set 'local' as searched text and expect only projects that contains 'local' to be displayed
  ## 405 Set 'leto' as searched text and expect only projects that contains 'leto' to be displayed
  ## 406 Set 'none' as searched text and expect no project is displayed
  ## 407 Set 'leto local' as searched text and expect all projects are displayed
  ## 408 Unset searched text and expect all projects are displayed

  ################## DisplayDiagrams.feature ##################
  ## 500 After diagrams creation, they present in the multi-diagrams view
  ## 501 Try to create a model with an already existing name should fail

  ################## RenameModel.feature ##################
  ## 600 Rename first model (diagram), created in 500

  ################## DeleteModel.feature ##################
  ## 700 Delete first model and check that it does not exit anymore

  ################## FilterModel.feature ##################
  ## 800 Filter by text and verify that some diagrams disappear
  ## 801 Clear filter text and verify all diagrams are present
  ## 802 Select Infrastructure tag and verify only all Infrastructure diagrams are present
  ## 803 Select CI tag and verify all diagrams are present
  ## 804 Unselect Infrastructure tag and verify only all CI diagrams are present
  ## 805 Unselect CI tag and verify all diagrams are present

  ################## AddComponent.feature ##################
  ## 900 Plugin test installed in component definitions list (Draw view) should not create project configuration file (Text view)
  ## 901 Add a component (Draw view) should create project configuration file (Text view)
  ## 902 Update plugin file content with a new object (Text view) should display the corresponding plugin component (Draw view)
  ## 903 Link two components (Draw view) should update plugin file content with new attributes properties (Text view)
  ## 904 Add link attributes inside plugin file content (Text view) should display link between two components (Draw view)

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'localProjectTest'
    And   I set context field 'remoteProjectName' with 'leto-modelizer-project-test'
    And   I set context field 'remoteProjectUrl' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'firstModelName' with 'firstModelTest'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I set context field 'firstModelFile' with 'model1/main.tf'
    And   I set context field 'secondModelFolder' with 'model2'
    And   I set context field 'secondModelName' with 'secondModelTest'
    And   I set context field 'secondModelFile' with 'model2/main.tf'
    And   I set context field 'thirdModelName' with 'thirdModelTest3Githubator.yml'
    And   I set context field 'modelRenamed' with 'newModelTest'
    And   I visit the '/'

  Scenario: Roundtrip about simple project

    ## 100 Home page should display an empty project message and one template project card
    Then I expect '[data-cy="project-grid-empty"]' exists
    And  I expect '[data-cy="project-grid-empty"]' is 'No projects, please create a new project to have one here 😉'
    And  I expect '[data-cy="template-card_project_template"]' exists
    And  I expect '[data-cy="template-card_project_template"] [data-cy="title-container"]' is 'Project template'

    ## 101 Creating a project with an empty name should display an error
    When I click on '[data-cy="create-project-button"]'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-form"] [role="alert"]' is 'Please type something'

    And I visit the '/'
    And I expect '[data-cy="create-project-button"]' exists

    ## 102 Create intial project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'

    ## 103  Created project should redirect to models page and send positive toast
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{projectName}}/models'
    
    When I visit the '/'

    ## 104 Created project should be in the projects list
    Then I expect '[data-cy="project-card_{{projectName}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{projectName}}"] [data-cy="title-container"]' is '{{projectName}}'

    ## 105 Created project should be in the left drawer
    Then I expect '[data-cy="project-expansion-item"] [data-cy="item_{{projectName}}"]' exists
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{projectName}}"]' is '{{projectName}}'
  
    When I visit the '/'
    Then I expect '[data-cy="create-project-button"]' exists
    
    ## 106 Create project with an already existing project name should display an error
    And  I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-form"] [role="alert"]' is 'Project name already exists.'

    When I visit the '/'
    Then I expect '[data-cy="project-card_localProjectTest"] [data-cy="rename-button"]' exists

    ## 200 Renaming existing project should update the project name in the projects list
    
    # Rename project and check project name is updated
    When I click on '[data-cy="project-card_localProjectTest"] [data-cy="rename-button"]'
    And  I set on '[data-cy="rename-project-form"] [data-cy="name-input"]' text 'renamedProject'
    And  I click on '[data-cy="rename-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been renamed 😉'
    And  I expect '[data-cy="project-card_renamedProject"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_renamedProject"] [data-cy="title-container"]' is 'renamedProject'
    But  I expect '[data-cy="project-card_localProjectTest"]' not exists

    ## 201 Renaming existing project should update the project name in the left drawer
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_renamedProject"]' appear 1 time on screen
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_renamedProject"]' is 'renamedProject'
    But  I expect '[data-cy="project-expansion-item"] [data-cy="item_projectTest"]' not exists

    ## 300 Delete project should remove it from the projects list
    When I click on '[data-cy="project-card_renamedProject"] [data-cy="delete-button"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="confirm-delete-checkbox"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been deleted 😥'
    And  I expect '[data-cy="delete-project-form"]' is closed
    And  I expect '[data-cy="project-card_renamedProject"]' not exists
    And  I expect '[data-cy="project-grid-empty"]' is 'No projects, please create a new project to have one here 😉'

    ## 301 Delete project should remove it from the left drawer
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_renamedProject"]' not exists
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item-empty"]' exists
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item-empty"]' is 'Nothing to display'

    # No Rename project button available
    But  I expect '[data-cy="project-card_projectTest"] [data-cy="rename-button"]' not exists

    ### 4XX
    # Recreate a local project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{projectName}}/models'
    And  I wait 1 second

    # Go back to HomePage
    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    # Recreate a remote projet
    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ remoteProjectUrl }}'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'
    And  I expect current url is '{{remoteProjectName}}/models'
    And  I wait 1 second

    # Go back to HomePage
    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    ## Select/unselect tag should filter the projects list
    # 400 Verify all project tags are inactive
    And  I expect '[data-cy="inactive-tag_local"]' exists
    And  I expect '[data-cy="inactive-tag_remote"]' exists

    # 401 Select local tag and verify only local projects are displayed
    When I click on '[data-cy="inactive-tag_local"]'
    Then I expect '[data-cy="inactive-tag_local"]' not exists
    And  I expect '[data-cy="active-tag_local"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' not exists
    And  I expect '[data-cy="project-card_{{projectName}}"]' appear 1 time on screen

    # 402 Select the remote tag and check that no project is present
    When I click on '[data-cy="inactive-tag_remote"]'
    Then I expect '[data-cy="inactive-tag_remote"]' not exists
    And  I expect '[data-cy="active-tag_remote"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' not exists
    And  I expect '[data-cy="project-card_{{projectName}}}"]' not exists

    # 403 Unselect local tag and verify only remote projects are displayed
    When I click on '[data-cy="active-tag_local"]'
    Then I expect '[data-cy="active-tag_local"]' not exists
    And  I expect '[data-cy="inactive-tag_local"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{projectName}}}"]' not exists

    ## Set/unset searched text should filter the projects list
    # 404 Set 'local' as searched text and expect only projects that contains 'local' to be displayed
    Then I click on '[data-cy="active-tag_remote"]'
    Then I set on '[data-cy="search-project-input"]' text 'local'
    Then I expect '[data-cy="project-card_{{remoteProjectName}}"]' not exists
    And  I expect '[data-cy="project-card_{{projectName}}"]' appear 1 time on screen

    # 405 Set 'leto' as searched text and expect only projects that contains 'leto' to be displayed
    When I set on '[data-cy="search-project-input"]' text 'leto'
    Then I expect '[data-cy="project-card_{{projectName}}"]' not exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' appear 1 time on screen

    # 406 Set 'none' as searched text and expect no project is displayed
    When I set on '[data-cy="search-project-input"]' text 'none'
    Then I expect '[data-cy="project-card_{{projectName}}"]' not exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' not exists

    # 407 Set 'leto local' as searched text and expect all projects are displayed
    When I set on '[data-cy="search-project-input"]' text 'leto local'
    Then I expect '[data-cy="project-card_{{projectName}}"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' exists

    # 408 Unset searched text and expect all projects are displayed
    When I set on '[data-cy="search-project-input"]' text ' '
    Then I expect '[data-cy="project-card_{{projectName}}"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' exists

    Then I click on '[data-cy="project-card_{{projectName}}"]'
    And I expect current url is 'projects/{{ projectName }}/models'

    ## 500 After diagrams creation, they present in the multi-diagrams view
    # First model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ firstModelFolder }}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists

    # Second model creation (with component)
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ secondModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ secondModelFolder }}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'
    And  I expect '[data-cy="file_model2/main.tf"]' not exists
    And  I expect '[data-cy="file_leto-modelizer.config.json"]' not exists

    # After clicking on a composent, it should be present
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    And  I expect '[data-cy="draw-container"]' exists
    And  I wait 1 second
    And  I expect '[id^="aws"]' exists

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists

    # Third model creation
    When I click on '[data-cy="create-model-button"]'
    And  I select '[data-cy="item_githubator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{thirdModelName}}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=githubator-plugin&path=\.github/workflows/{{thirdModelName}}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_githubator-plugin"] [data-cy="title"]' is 'githubator-plugin'

    # All created diagrams should be displayed in the /diagrams view
    When I visit the 'localhost:8080/#/projects/{{ projectName }}/diagrams'
    Then I expect '[data-cy="diagram-card_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-card_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-card_\.github/workflows/{{thirdModelName}}"]' exists

    # Back to the models page
    When I visit the 'localhost:8080/#/projects/{{ projectName }}/models'
    And  I wait 2 second
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' exists

    ## 501 Try to create a model with an already existing name should fail
    When I click on '[data-cy="create-model-button"]'
    And  I select '[data-cy="item_githubator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{thirdModelName}}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-model-form"] [role="alert"]' is 'Model name already exists for this plugin.'

    # Back to the models page
    Then I click on '[data-cy="close-dialog-button"]'

    ## 600 Rename first model (diagram)
    When I click on '[data-cy="diagram-actions_{{firstModelFolder}}"]'
    Then I expect '[data-cy="diagrams-table-action-menu"]' exists

    When I click on '[data-cy="diagrams-table-action-menu"] [data-cy="rename-diagram-action-item"]'
    Then I expect '[data-cy="rename-model-dialog"]' exists
    And  I expect field '[data-cy="rename-model-form"] [data-cy="name-input"]' is '{{ firstModelFolder }}'

    When I set on '[data-cy="rename-model-form"] [data-cy="name-input"]' text '{{ modelRenamed }}'
    And  I click on '[data-cy="rename-model-form"] [data-cy="submit-button"]'
    # After the renaming, the new model name should be present but not the old one 
    Then I expect '[data-cy="diagram-path_{{ modelRenamed }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' not exists

    # Click on model and go to text view and check files
    When I click on '[data-cy="diagram-path_{{ modelRenamed }}"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ modelRenamed }}'
    And  I expect '[data-cy="components-definitions-drawer"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ modelRenamed }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ modelRenamed }}"]' exists
    And  I wait 1 second

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    And  I expect '[data-cy="diagram-path_{{ modelRenamed }}"]' exists

    ## 700 Delete first model and check that it does not exit anymore
    When I click on '[data-cy="diagram-actions_{{modelRenamed}}"]'
    Then I expect '[data-cy="diagrams-table-action-menu"]' exists

    When I click on '[data-cy="diagrams-table-action-menu"] [data-cy="delete-diagram-action-item"]'
    Then I expect '[data-cy="delete-model-dialog"]' exists

    When I click on '[data-cy="delete-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="diagram-path_{{modelRenamed}}"]' not exists

    When I click on '[data-cy="diagram-path_{{secondModelFolder}}"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ secondModelFolder }}'

    # Go to text view and check files of first model doesn't exists but second one does
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=terrator-plugin&path={{ secondModelFolder }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ secondModelFolder }}"]' exists

    ## Back to the models page
    When I visit the 'localhost:8080/#/projects/{{ projectName }}/models'
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' exists

    # 800 Filter by text and verify that some diagrams disappear
    When I set on '[data-cy="search-diagram-input"]' text '1'
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' not exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' not exists

    # 801 Clear filter text and verify all diagrams are present
    When I set on '[data-cy="search-diagram-input"]' text ' '
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' exists

    # 802 # Select Infrastructure tag and verify only all Infrastructure diagrams are present
    When I select '[data-cy="select-checkbox_Infrastructure"]' in '[data-cy="diagram-tag-select"]'
    And  I click on '[data-cy="diagram-tag-select"]'
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' not exists

    # 803 Select CI tag and verify all diagrams are present
    When I select '[data-cy="select-checkbox_CI"]' in '[data-cy="diagram-tag-select"]'
    And  I click on '[data-cy="diagram-tag-select"]'
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' exists

    # 804 Unselect Infrastructure tag and verify only all CI diagrams are present
    When I click on '[data-cy="chip_Infrastructure"] i[aria-label="Remove"]'
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' not exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' exists

    # 805 Unselect CI tag and verify all diagrams are present
    When I click on '[data-cy="chip_CI"] i[aria-label="Remove"]'
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' exists

    Then  I click on '[data-cy="diagram-path_{{secondModelFolder}}"]'

    ## Select 'terrator-plugin' library
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 18 times on screen

    ## 900 Plugin test installed in component definitions list (Draw view) should not create project configuration file (Text view)
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second

    ## 901 Add a component (Draw view) should create project configuration file (Text view)
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    # TODO: put the correct name once bug is fixed
    And  I expect '[data-cy="file_model2/new_file.tf"]' appear 2 time on screen

    When I double click on '[data-cy="file_model2/new_file.tf"]'
    And  I wait 1 second
    And  I expect '[data-cy="file_model2/new_file.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'provider.*"aws".*{}'

    ## 902 Update plugin file content with a new object (Text view) should display the corresponding plugin component (Draw view)
    When I click on '[data-cy="file-tabs-container"] [data-cy="file_model2/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    When I set active file content to 'module "server" {}'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    
    # components added in 901 should not exist anymore
    And  I expect '[id^="server"]' exists
    But  I expect '[id^="aws"]' not exists

    ## 903 Link two components (Draw view) should update plugin file content with new attributes properties (Text view)
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I wait 1 second

    When I click on '[data-cy="component-definition_aws_subnet"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_aws_internet_gateway"]'
    And  I wait 1 second
    And  I click on '[id^="aws_subnet"]'
    And  I click on '[id="create-link"]'
    And  I click on '[id^="aws_internet_gateway"]'
    Then I expect '[class="link"]' exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_model2/new_file.tf"]' appear 2 time on screen
    And  I expect '[data-cy="file_leto-modelizer.config.json"]' appear 1 time on screen

    When I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_model2/new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'resource.*"aws_subnet".*"aws_subnet_1".*{.*gateway_id.*=.*\["aws_internet_gateway_1"\]}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"aws_internet_gateway_1".*{}'

    ## 904 Add link attributes inside plugin file content (Text view) should display link between two components (Draw view)
    ## New Test to replace the previous one
    When I set active file content to 'resource "aws_key_pair" "aws_key_pair_1" {} resource "aws_route" "aws_route_1" {}'
    And  I wait 1 seconds
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[id^="aws_key_pair_1"]' exists
    And  I expect '[id^="aws_route_1"]' exists
    # previous components should not exists anymore
    And  I expect '[id^="aws_subnet"]' not exists
    And  I expect '[id^="aws_internet_gateway"]' not exists
    But  I expect '[class="link"]' not exists
