Feature: Test roundtrip of the application: project creation

  ################## CreateProject.feature ##################
  ## 100 Home page should display an empty project message and one template project card
  ## 101 Creating project with empty name should display an error
  ## 102 Create initial project
  ## 103 Created project should redirect to models page and send positive toast
  ## 104 Created project should be in the projects list
  ## 106 Create project with an already existing project name should display an error

  ################## OpenProject.feature ##################
  ## 107 Click on project card in projects list should redirect to 'models' page

  ################## RenameProject.feature ##################
  ## 200 Renaming existing project should update the project name in the projects list

  ################## DeleteProject.feature ##################
  ## 300 Delete project should remove it from the projects list

  ################## DisplayDiagrams.feature ##################
  ## 501 Try to create a model with an already existing name should fail

  ################## RenameModel.feature ##################
  ## 600 Rename first model (diagram), created in 500

  ################## DeleteModel.feature ##################
  ## 700 Delete first model and check that it does not exit anymore

  ################## AddComponent.feature ##################
  ## 900 Plugin test installed in component definitions list (Draw view) should not create project configuration file (Text view)
  ## 901 Add a component (Draw view) should create project configuration file (Text view)
  ## 902 Update plugin file content with a new object (Text view) should display the corresponding plugin component (Draw view)
  ## 903 Link two components (Draw view) should update plugin file content with new attributes properties (Text view)
  ## 904 Add link attributes inside plugin file content (Text view) should display link between two components (Draw view)

  Scenario: Roundtrip about simple project

    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'localProjectTest'
    And   I set context field 'remoteProjectName' with 'leto-modelizer-project-test'
    And   I set context field 'remoteProjectUrl' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I set context field 'secondModelFolder' with 'model2'
    And   I set context field 'thirdModelName' with 'thirdModelTest3Githubator.yml'
    And   I set context field 'projectRenamed' with 'renamedProject'
    And   I set context field 'modelRenamed' with 'newModelTest'
    And   I visit the '/'
    And   I wait until the application is loaded

    ## 100 Home page should display an empty project message
    Then I expect '[data-cy="project-grid-empty"]' exists
    And  I expect '[data-cy="project-grid-empty"]' is 'No projects, please create a new project to have one here 😉'

    ## 101 Creating a project with an empty name should display an error
    When I click on '[data-cy="create-project-button"]'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-form"] [role="alert"]' is 'Please type something'
    When I click on '[data-cy="close-dialog-button"]'

    ## 102 Create initial project
    And I click on '[data-cy="create-project-button"]'
    And I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'

    ## 103 Created project should redirect to models page and send positive toast
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{projectName}}/models'

    ## 104 Created project should be in the projects list
    When I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect '[data-cy="project-card_{{projectName}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{projectName}}"] [data-cy="title-container"]' is '{{projectName}}'

    ## 106 Create project with an already existing project name should display an error
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-form"] [role="alert"]' is 'Project name already exists.'
    When I click on '[data-cy="close-dialog-button"]'

    ## 107 Click on project card in projects list should redirect to 'models' page
    Then I expect '[data-cy="project-card_{{ projectName }}"]' exists
    And  I expect '[data-cy="project-card_{{ projectName }}"] [data-cy="title-container"]' is '{{ projectName }}'

    When I click on '[data-cy="project-card_{{ projectName }}"]'
    Then I expect current url is '{{ projectName }}/models'

    # Go back to HomePage
    When I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    ## 200 Renaming existing project should update the project name in the projects list

    # Rename project and check project name is updated
    When I click on '[data-cy="project-card_{{projectName}}"] [data-cy="rename-button"]'
    And  I set on '[data-cy="rename-project-form"] [data-cy="name-input"]' text '{{projectRenamed}}'
    And  I click on '[data-cy="rename-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been renamed 😉'
    And  I expect '[data-cy="project-card_{{projectRenamed}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{projectRenamed}}"] [data-cy="title-container"]' is '{{projectRenamed}}'
    But  I expect '[data-cy="project-card_{{projectName}}"]' not exists

    ## 300 Delete project should remove it from the projects list
    When I click on '[data-cy="project-card_{{projectRenamed}}"] [data-cy="delete-button"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="confirm-delete-checkbox"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been deleted 😥'
    And  I expect '[data-cy="delete-project-form"]' is closed
    And  I expect '[data-cy="project-card_{{projectRenamed}}"]' not exists
    And  I expect '[data-cy="project-grid-empty"]' is 'No projects, please create a new project to have one here 😉'

    # No Rename project button available
    But  I expect '[data-cy="project-card_projectTest"] [data-cy="rename-button"]' not exists

    ### Setup for tests 400-408
    # Recreate a local project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{projectName}}/models'

    # Go back to HomePage
    When I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    # Recreate a remote projet
    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ remoteProjectUrl }}'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'
    And  I expect current url is '{{remoteProjectName}}/models'

    # Go back to HomePage
    When I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    # First model creation
    When  I click on '[data-cy="project-card_{{projectName}}"]'
    And  I expect current url is 'projects/{{ projectName }}/models'
    And  I wait 1 seconds
    And  I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ firstModelFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform'

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists

    # Second model creation (with component)
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ secondModelFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ secondModelFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform'
    And  I expect '[data-cy="file_{{ projectName }}/model2/new_file.tf"]' not exists
    And  I expect '[data-cy="file_{{ projectName }}/leto-modelizer.config.json"]' not exists

    # After clicking on a composent, it should be present
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    Then I expect '[data-cy="draw-container"]' exists
    # definition_aws
    And  I expect '.id_1.component' exists

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists

    # Third model creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/githubator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{thirdModelName}}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/githubator-plugin&path=\.github/workflows/{{thirdModelName}}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/githubator-plugin"] [data-cy="title"]' is 'GitHub Action'

    # Back to the models page
    When I visit the '/projects/{{ projectName }}/models'
    And  I wait until the application is loaded
    Then I expect '[data-cy="diagram-path_{{ firstModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_{{ secondModelFolder }}"]' exists
    And  I expect '[data-cy="diagram-path_\.github/workflows/{{thirdModelName}}"]' exists

    ## 501 Try to create a model with an already existing name should fail
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/githubator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{thirdModelName}}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-model-form"] [role="alert"]' is 'Model name already exists for this plugin.'

    # Back to the models page
    When I click on '[data-cy="close-dialog-button"]'

    ## 600 Rename first model (diagram)
    And  I click on '[data-cy="diagram-actions_{{firstModelFolder}}"]'
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
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ modelRenamed }}'
    And  I wait 1 second
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform'

    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=@ditrit/terrator-plugin&path={{ modelRenamed }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ modelRenamed }}"]' exists

    # Back to the models page
    When I click on '[data-cy="models-page-link-button"]'
    And  I wait 1 second
    Then I expect '[data-cy="diagram-path_{{ modelRenamed }}"]' exists

    ## 700 Delete first model and check that it does not exist anymore
    When I click on '[data-cy="diagram-actions_{{modelRenamed}}"]'
    Then I expect '[data-cy="diagrams-table-action-menu"]' exists

    When I click on '[data-cy="diagrams-table-action-menu"] [data-cy="delete-diagram-action-item"]'
    Then I expect '[data-cy="delete-model-dialog"]' exists

    When I click on '[data-cy="delete-model-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="diagram-path_{{modelRenamed}}"]' not exists

    When I click on '[data-cy="diagram-path_{{secondModelFolder}}"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ secondModelFolder }}'
    And  I wait 1 second

    # Go to text view and check files of first model doesn't exist but second one does
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=@ditrit/terrator-plugin&path={{ secondModelFolder }}'
    And  I wait 1 second
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ secondModelFolder }}"]' exists

    ## Back to the models page
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    And  I click on '[data-cy="models-page-link-button"]'
    Then I expect '[data-cy="diagram-path_{{secondModelFolder}}"]' exists

    When I click on '[data-cy="diagram-path_{{secondModelFolder}}"]'

    ## Select '@ditrit/terrator-plugin' library
    And  I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 35 times on screen
    And  I wait 1 second

    ## 900 Plugin test installed in component definitions list (Draw view) should not create project configuration file (Text view)
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' exists

    ## 901 Add a component (Draw view) should create project configuration file (Text view)
    And  I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_{{ projectName }}/model2/new_file.tf"]' appear 2 times on screen

    When I double click on '[data-cy="file_{{ projectName }}/model2/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file_{{ projectName }}/model2/new_file.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'provider.*"aws".*{}'

    ## 902 Update plugin file content with a new object (Text view) should display the corresponding plugin component (Draw view)
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    When I clear active file
    And  I set active file content to 'module "server" {}'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'

    # components added in 901 should not exist anymore, only the latest exist
    # definition_aws
    And  I expect '.id_1.component' exists

    ## 903 Link two components (Draw view) should update plugin file content with new attributes properties (Text view)
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_aws_subnet"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_aws_internet_gateway"]'
    And  I wait 1 second
    # aws_subnet
    And I click on '.id_2.component .menu-button'
    And I click on '[data-cy="add-link-button"]'
    And I click on '[data-cy="link-to-component-id_3-button"]'
    Then I expect '.id_2_to_id_3.link' exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_{{ projectName }}/model2/new_file.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file_{{ projectName }}/leto-modelizer.config.json"]' appear 1 time on screen

    When I click on '[data-cy="file-tabs-container"] [data-cy="file_{{ projectName }}/model2/new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'resource.*"aws_subnet".*"id_2".*{}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"id_3".*{}'
    But  I expect active file content to not contain 'gateway_id.*=.*\["id_3"\]'

    ## 904 Add link attributes inside plugin file content (Text view) should display link between two components (Draw view)
    When I clear active file
    And  I set active file content to 'resource "aws_key_pair" "aws_key_pair_1" {} resource "aws_route" "aws_route_1" {}'
    And  I wait 1 second
    Then I expect active file content to not contain 'resource.*"aws_subnet".*"aws_subnet_1".*{}'
    And  I expect active file content to not contain 'resource.*"aws_internet_gateway".*"aws_internet_gateway_1".*{}'
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    # aws_key_pair_1
    And  I expect '.id_1.component' exists
    # aws_route_1
    And  I expect '.id_2.component' exists
    # previous components should not exist anymore
    But  I expect '.id_2_to_id_3.link' not exists
