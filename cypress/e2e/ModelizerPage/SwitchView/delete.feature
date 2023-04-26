Feature: Test switch model to text view: delete component/link

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
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 18 times on screen
    And  I wait 1 second

  Scenario: Delete a component (Draw view) should remove plugin file (Text view)
    When I click on '[data-cy="component-definition_aws"]'
    Then I expect '[id^="aws"]' exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="file-explorer"] [data-cy="folder_projectName"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="file-explorer"] [data-cy="folder_terrator-plugin/modelName"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/modelName/new_file.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'provider.*"aws".*{}'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists

    When I click on '[id^="aws"]'
    And  I click on '[id="remove-component"]'
    Then I expect '[id^="aws"]' not exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists
    But  I expect '[data-cy="file_new_file.tf"]' not exists

  Scenario: Delete one of two components (Draw view) should remove corresponding object inside plugin file content (Text view)
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_server"]'
    Then I expect '[id^="aws"]' exists
    And  I expect '[id^="server"]' exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
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
    And  I expect active file content to contain 'provider.*"aws".*{}'
    And  I expect active file content to contain 'provider.*"server".*{}'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists

    When I wait 1 second
    And  I click on '[id^="aws"]'
    And  I click on '[id="remove-component"]'
    And  I wait 1 second
    Then I expect '[id^="server"]' exists
    And  I expect '[id^="aws"]' not exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    And  I wait 1 second
    Then I expect active file content to contain 'module.*"server".*{}'
    But  I expect active file content to not contain 'provider.*"aws".*{}'

  Scenario: Remove object inside plugin file content (Text view) should remove related component (Draw view)
    #  NOTE: NOT WORKING if plugin file content is empty (error console -> TypeError: JSON.parse(...) is null - new_file.tf)
    When I click on '[data-cy="component-definition_aws"]'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
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

    When I set active file content to '[]'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    But  I expect '[id^="aws"]' not exists

  Scenario: Remove one of the two objects inside plugin file content (Text view) should only display the remaining component
    When I click on '[data-cy="component-definition_aws"]'
    And  I wait 1 second
    And  I click on '[data-cy="component-definition_server"]'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
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

    When I set active file content to 'provider "aws" {}'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    And  I expect '[id^="aws"]' exists
    But  I expect '[id^="server"]' not exists

  Scenario: Delete plugin file (Text view) should remove related component (Draw view)
    When I click on '[data-cy="component-definition_aws"]'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists

    When I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
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

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_terrator-plugin/modelName/new_file.tf"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_terrator-plugin/modelName/new_file.tf"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file_terrator-plugin/modelName/new_file.tf"]' not exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    And  I expect '[id^="aws"]' not exists

  Scenario: Delete a link between two components (Draw view) should remove corresponding attribute in object inside plugin file content (Text view)
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

    When I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
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
    And  I expect active file content to contain 'resource.*"aws_subnet".*"aws_subnet_1".*{.*gateway_id.*=.*\["aws_internet_gateway_1"\]}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"aws_internet_gateway_1".*{}'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    And  I expect '[class="link"]' appear 1 time on screen

    #  NOTE: must force click because the following two elements are covered by an overflowing svg element
    When I force click on '[class="link"]'
    And  I force click on '[id="remove-link"]'
    Then I expect '[class="link"]' not exists

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    And  I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists
    And  I expect active file content to contain 'resource.*"aws_subnet".*"aws_subnet_1".*{}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"aws_internet_gateway_1".*{}'
    But  I expect active file content to not contain 'gateway_id.*=.*\["aws_internet_gateway_1"\]'

  Scenario: Remove link attribute inside plugin file content (Text view) should remove the link between the two components (Draw view)
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

    When I click on '[data-cy="folder_projectName"]'
    And  I click on '[data-cy="folder_terrator-plugin"]'
    And  I click on '[data-cy="folder_terrator-plugin/modelName"]'
    And  I double click on '[data-cy="file_terrator-plugin/modelName/new_file.tf"]'
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
    And  I expect active file content to contain 'resource.*"aws_subnet".*"aws_subnet_1".*{.*gateway_id.*=.*\["aws_internet_gateway_1"\]}'
    And  I expect active file content to contain 'resource.*"aws_internet_gateway".*"aws_internet_gateway_1".*{}'

    When I set active file content to 'resource "aws_subnet" "aws_subnet_1" {} resource "aws_internet_gateway" "aws_internet_gateway_1" {}'
    And  I wait 1 second
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    And  I expect '[class="link"]' not exists
    And  I expect '[id^="aws_subnet"]' exists
    And  I expect '[id^="aws_internet_gateway"]' exists
