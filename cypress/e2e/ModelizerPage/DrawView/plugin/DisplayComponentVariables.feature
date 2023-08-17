Feature: Test modelizer draw view: add plugin component variable

  Scenario: Add variables inside component parsable files should display it on the variables tab inside modelizer draw left drawer
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infra'
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    # Go to Text page
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    Then I expect current url is 'projectName/modelizer/text\?plugin=terrator-plugin&path=infra'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_projectName"]' is 'projectName'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_infra"]' exists
    And  I expect '[data-cy="file-explorer"] [data-cy="file_infra/main.tf"]' exists

    # Add two variables with same category to infra/main.tf file
    When I set active file content to 'variable "instance_class" {} variable "instance_var" { value = var }'

    # Create new file named variable.tf
    And  I hover '[data-cy="file-explorer"] [data-cy="folder-button_infra"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_infra"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'variable.tf'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'variable.tf'

    # Add two variables with different category to infra/variable.tf file
    When I set active file content to 'output "instance_ip" { value = aws_instance.server } variable "instance_test" { value = test }'

    # Go to Draw page
    And  I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infra'
    And  I expect '[data-cy="draw-page-left-drawer"]' exists
    And  I expect '[data-cy="draw-page-variables-tab"]' exists

    # Check both variables inside infra/main.tf
    When I click on '[data-cy="draw-page-variables-tab"]'
    Then I expect '[data-cy="variable-list"]' exists
    And  I expect '[data-cy="variable-item_infra/main.tf"]' exists
    And  I expect '[data-cy="variable-item_infra/main.tf_variable"]' exists
    And  I expect '[data-cy="name_instance_class"]' exists
    And  I expect '[data-cy="value_null"]' exists
    And  I expect '[data-cy="name_instance_var"]' exists
    And  I expect '[data-cy="value_var"]' exists
    # Check both variables inside infra/variable.tf
    And  I expect '[data-cy="variable-item_infra/variable.tf"]' exists
    And  I expect '[data-cy="variable-item_infra/variable.tf_output"]' exists
    And  I expect '[data-cy="name_instance_ip"]' exists
    And  I expect '[data-cy="value_aws_instance.server"]' exists
    And  I expect '[data-cy="variable-item_infra/variable.tf_variable"]' exists
    And  I expect '[data-cy="name_instance_test"]' exists
    And  I expect '[data-cy="value_test"]' exists
