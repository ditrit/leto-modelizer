Feature: Test switch model to text view: add component/link

  Background:
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'modelName'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?path=terrator-plugin/modelName'
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    # Select 'terrator-plugin' library
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 18 times on screen

  Scenario: Plugin test installed in component definitions list (Draw view) should not create project configuration file (Text view)
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_projectName"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    Then I expect '[data-cy="file_new_file.tf"]' not exists
    And  I expect '[data-cy="file_leto-modelizer.config.json"]' not exists

  Scenario: Add a component (Draw view) should create project configuration file (Text view)
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_projectName"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/modelName"]'
    Then I expect '[data-cy="file_terrator-plugin/modelName/new_file.tf"]' appear 1 time on screen
    And  I expect '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]' appear 1 time on screen


    When I double click on '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file_terrator-plugin/modelName/new_file.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'leto-modelizer.config.json'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'provider.*"aws".*{}'

  Scenario: Update plugin file content with a new object (Text view) should display the corresponding plugin component (Draw view)
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_projectName"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/modelName"]'
    Then I expect '[data-cy="file_terrator-plugin/modelName/new_file.tf"]' appear 1 time on screen
    And  I expect '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]' appear 1 time on screen

    When I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]'
    And  I wait 1 second
    Then I expect '[data-cy="file_terrator-plugin/modelName/new_file.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'leto-modelizer.config.json'

    When I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    When I set active file content to 'module "server" {}'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    And  I expect '[id^="server"]' exists
    But  I expect '[id^="aws"]' not exists

  Scenario: Link two components (Draw view) should update plugin file content with new attributes properties (Text view)
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
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_projectName"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/modelName"]'
    Then I expect '[data-cy="file_terrator-plugin/modelName/new_file.tf"]' appear 1 time on screen
    And  I expect '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]' appear 1 time on screen

    When I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'leto-modelizer.config.json'

    When I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'resource.*"aws_subnet".*"aws_subnet_1".*{.*gateway_id.*=.*\["aws_internet_gateway_1"\]}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"aws_internet_gateway_1".*{}'

  Scenario: Add link attributes inside plugin file content (Text view) should display link between two components (Draw view)
    When I click on '[data-cy="component-definition_aws_subnet"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_aws_internet_gateway"]'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_projectName"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/modelName"]'
    Then I expect '[data-cy="file_terrator-plugin/modelName/new_file.tf"]' appear 1 time on screen
    And  I expect '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]' appear 1 time on screen

    When I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    And  I wait 1 second
    And  I double click on '[data-cy="file_terrator-plugin/modelName/leto-modelizer.config.json"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'new_file.tf'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'leto-modelizer.config.json'

    When I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'resource.*"aws_subnet".*"aws_subnet_1".*{}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"aws_internet_gateway_1".*{}'
    But  I expect active file content to not contain 'gateway_id.*=.*\["aws_internet_gateway_1"\]'

    When I set active file content to 'resource "aws_subnet" "aws_subnet_1" { gateway_id = \["aws_internet_gateway_1"\] } resource "aws_internet_gateway" "aws_internet_gateway_1" {}'
    And  I wait 2 seconds
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    And  I wait 1 second
    And  I expect '[id^="aws_subnet"]' exists
    And  I expect '[id^="aws_internet_gateway"]' exists
    And  I expect '[class="link"]' exists
