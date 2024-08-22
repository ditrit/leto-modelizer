Feature: Test switch model to text view: add component/link

  Background:
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=@ditrit/terrator-plugin&path=infra'
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform'

    # Select '@ditrit/terrator-plugin' library
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 35 times on screen

  Scenario: Plugin test installed in component definitions list (Draw view) should not create project configuration file (Text view)
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_projectName/new_file.tf"]' not exists
    And  I expect '[data-cy="file_projectName/leto-modelizer.config.json"]' not exists

  Scenario: Add a component (Draw view) should create project configuration file (Text view)
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_projectName/infra/new_file.tf"]' appear 2 times on screen

    When I double click on '[data-cy="file_projectName/infra/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file_projectName/infra/new_file.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'provider.*"aws".*{}'

  Scenario: Update plugin file content with a new object (Text view) should display the corresponding plugin component (Draw view)
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_projectName/infra/new_file.tf"]' appear 2 times on screen

    When I double click on '[data-cy="file_projectName/infra/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file_projectName/infra/new_file.tf"]' appear 2 times on screen

    When I click on '[data-cy="file-tabs-container"] [data-cy="file_projectName/infra/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'

    When I set active file content to 'module "server" {}'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '.id_1.component' exists
    But  I expect '.id_2.component' not exists

  Scenario: Link two components (Draw view) should update plugin file content with new attributes properties (Text view)
    When I click on '[data-cy="component-definition_aws_subnet"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_aws_internet_gateway"]'
    And  I wait 1 second
    And  I click on '.id_1.component .menu-button'
    And  I click on '[data-cy="add-link-button"]'
    And  I click on '[data-cy="link-to-component-id_2-button"]'
    Then I expect '.id_1_to_id_2.link' exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_projectName/infra/new_file.tf"]' appear 2 times on screen
    And  I expect '[data-cy="file_projectName/leto-modelizer.config.json"]' appear 1 time on screen

    When I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_projectName/infra/new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to be equal to "cypress/resources/project-test/main.tf"

  Scenario: Add link attributes inside plugin file content (Text view) should display link between two components (Draw view)
    When I click on '[data-cy="component-definition_aws_subnet"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_aws_internet_gateway"]'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="file_projectName/infra/new_file.tf"]' appear 2 times on screen

    When I wait 1 second
    And  I click on '[data-cy="file-tabs-container"] [data-cy="file_projectName/infra/new_file.tf"]'
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'resource.*"aws_subnet".*"id_1".*{}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"id_2".*{}'
    But  I expect active file content to not contain 'gateway_id.*=.*\["aws_internet_gateway_1"\]'

    When I set active file content to 'resource "aws_subnet" "aws_subnet_1" { gateway_id = [aws_internet_gateway.aws_internet_gateway_1.id] } resource "aws_internet_gateway" "aws_internet_gateway_1" {}'
    And  I wait 2 seconds
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I wait 1 second
    And  I expect '.id_1.component' exists
    And  I expect '.id_2.component' exists
    And  I expect '.id_1_to_id_2.link' exists
