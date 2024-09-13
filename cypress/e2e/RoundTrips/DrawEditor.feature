Feature: Test roundtrip of the application: draw editor

  ################## plugin/InitPlugin.feature ##################
  ## 101 Terrator plugin should appear in component definitions list
  ## 102 Should have only one plugin installed with all these definitions

  ################## plugin/FilterPlugin.feature ##################
  ## 201 Set text as 'aws_ami' should display only one element inside plugin title
  ## 202 Set text as 'ami server' should display two elements inside plugin title
  ## 203 Set text as 'bad' should not display plugin
  ## 204 Select plugin and set text as 'aws_ami' should display only one element
  ## 205 Select plugin and set text as 'ami server' should display only two elements
  ## 206 Select plugin and set text as 'bad' should not display any elements.
  ## 207 Set text as 'aws_ami' then select plugin should display only one element

  ################## plugin/DisplayComponent.feature ##################
  ## 301 Click on the 'aws_ami' component should display it on the page

  ################## plugin/ArrangeComponentsPosition.feature ##################
  ## 401 Click on the "rearrange" icon button should reorganize components

  ################## plugin/RenameComponentId.feature ##################
  ## 501 When I rename a component (external) id, it is updated in the draw area

  ################## DeleteComponent.feature ##################
  ## 601 Delete component should hide detail panel

  ################## DisplayComponentVariables.feature ##################
  ## 701 Add variables inside component parsable files should display it on the variables tab inside modelizer draw left drawer

  ################## template/InitTemplate.feature ##################
  ## 801 Template should appear in component definitions list
  ## 802 Should have only one templates library installed with all these definitions

  ################## template/FilterTemplate.feature ##################
  ## 901 Set text as 'Aws provider' should display only one element inside template title
  ## 902 Set text as 'bad' should not display template
  ## 903 Select template and set text as 'Aws provider' should display only one element
  ## 904 Select template and set text as 'bad' should not display any elements
  ## 905 Set text as 'Aws provider' then select templates library should display only one element

  ################## template/DisplayComponent.feature ##################
  ## 1001 Click on the Test application component should display it on the page

  Scenario: Roundtrip about draw editor
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'diagramFolder' with 'diagram'
    And   I set context field 'diagramFile' with 'diagram/main.tf'
    And   I visit the '/'
    And   I wait until the application is loaded

    # Create project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ projectName }}/models'

    # Create model
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ diagramFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ diagramFolder }}'

    ## 101 Terrator plugin should appear in component definitions list
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform'

    ## 102 Should have only one plugin installed with all these definitions
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected [data-cy="title"]' is 'Terraform (35)'
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 35 times on screen
    And  I expect '[data-cy="component-definition_aws"]' exists
    And  I expect '[data-cy="component-definition_aws_ami"]' exists
    And  I expect '[data-cy="component-definition_aws_rds_engine_version"]' exists
    And  I expect '[data-cy="component-definition_aws_availability_zones"]' exists
    And  I expect '[data-cy="component-definition_server"]' exists
    And  I expect '[data-cy="component-definition_aws_security_group"]' exists
    And  I expect '[data-cy="component-definition_aws_instance"]' exists
    And  I expect '[data-cy="component-definition_aws_volume_attachment"]' exists
    And  I expect '[data-cy="component-definition_aws_ebs_volume"]' exists
    And  I expect '[data-cy="component-definition_aws_elb"]' exists
    And  I expect '[data-cy="component-definition_aws_vpc"]' exists
    And  I expect '[data-cy="component-definition_aws_internet_gateway"]' exists
    And  I expect '[data-cy="component-definition_aws_route"]' exists
    And  I expect '[data-cy="component-definition_aws_subnet"]' exists
    And  I expect '[data-cy="component-definition_aws_db_subnet_group"]' exists
    And  I expect '[data-cy="component-definition_aws_route53_zone"]' exists
    And  I expect '[data-cy="component-definition_aws_route53_record"]' exists
    And  I expect '[data-cy="component-definition_aws_db_instance"]' exists
    And  I expect '[data-cy="component-definition_aws_key_pair"]' exists
    And  I expect '[data-cy="component-definition_aws_route_table"]' exists
    And  I expect '[data-cy="component-definition_aws_route_table_association"]' exists
    And  I expect '[data-cy="component-definition_aws_s3_bucket"]' exists
    And  I expect '[data-cy="component-definition_aws_s3_bucket_acl"]' exists
    And  I expect '[data-cy="component-definition_aws_lb"]' exists
    And  I expect '[data-cy="component-definition_aws_lb_target_group"]' exists
    And  I expect '[data-cy="component-definition_aws_launch_configuration"]' exists
    And  I expect '[data-cy="component-definition_aws_autoscaling_policy"]' exists
    And  I expect '[data-cy="component-definition_aws_cloudwatch_metric_alarm"]' exists
    And  I expect '[data-cy="component-definition_aws_efs_file_system"]' exists
    And  I expect '[data-cy="component-definition_aws_lb_listener"]' exists
    And  I expect '[data-cy="component-definition_aws_efs_mount_target"]' exists
    And  I expect '[data-cy="component-definition_random_string"]' exists
    And  I expect '[data-cy="component-definition_random_password"]' exists
    And  I expect '[data-cy="component-definition_aws_autoscaling_group"]' exists
    And  I expect '[data-cy="component-definition_image_id"]' exists

    # Initial state
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected' not exists

    ## 201 Set text as 'aws_ami' should display only one element inside plugin title
    When I set on '[data-cy="definitions-filter-input"]' text 'aws_ami'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (1)'

    ## 202 Set text as 'ami server' should display two elements inside plugin title
    When I set on '[data-cy="definitions-filter-input"]' text 'ami server'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (2)'

    ## 203 Set text as 'bad' should not display plugin
    When I set on '[data-cy="definitions-filter-input"]' text 'bad'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' appear 0 time on screen
    But  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    # Initial state
    When I set on '[data-cy="definitions-filter-input"]' text ''
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (35)'

    # Select '@ditrit/terrator-plugin' library
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 35 times on screen

    ## 204 Select plugin and set text as 'aws_ami' should display only one element
    When I set on '[data-cy="definitions-filter-input"]' text 'aws_ami'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (1)'
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definition_aws_ami"]' exists

    ## 205 Select plugin and set text as 'ami server' should display only two elements
    When I set on '[data-cy="definitions-filter-input"]' text 'ami server'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (2)'
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen
    And  I expect '[data-cy="component-definition_aws_ami"]' exists
    And  I expect '[data-cy="component-definition_server"]' exists

    ## 206 Select plugin and set text as 'bad' should not display any elements.
    When I set on '[data-cy="definitions-filter-input"]' text 'bad'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 0 time on screen
    And  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    # Initial state
    When I set on '[data-cy="definitions-filter-input"]' text ''
    And  I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (35)'
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected' not exists

    ## 207 Set text as 'aws_ami' then select plugin should display only one element
    When I set on '[data-cy="definitions-filter-input"]' text 'aws_ami'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (1)'

    # Select '@ditrit/terrator-plugin' library
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"].selected [data-cy="title"]' is 'Terraform (1)'
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definition_aws_ami"]' exists

    # Initial state
    When I set on '[data-cy="definitions-filter-input"]' text ''
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (35)'

    ## 301 Click on the 'aws_ami' component should display it on the page
    And  I expect '.id_1.component' not exists

    When I click on '[data-cy="component-definition_aws_ami"]'
    And  I wait 1 second
    Then I expect '.id_1.component' exists
    And  I expect '.id_1.component' appear 1 time on screen

    ## 401 Click on the "rearrange" icon button should reorganize components
    # Add 2 components
    When I click on '[data-cy="component-definition_server"]'
    And  I click on '[data-cy="component-definition_aws_subnet"]'
    And  I wait 1 second
    Then I expect '.id_1.component' exists
    And  I expect '.id_2.component' exists
    And  I expect '.id_3.component' exists

    # Check their positions before rearranging
    And I expect component ".id_1.component .model" to be at position 30,30
    And I expect component ".id_2.component .model" to be at position 30,130
    And I expect component ".id_3.component .model" to be at position 130,30

    When I drag ".id_3.component .model" of 100,100
    ## TODO: Uncomment when pixel error are resolved.
    # Then I expect component ".id_3.component .model" to be at position 230,130

    # Rearrange
    And I click on '[data-cy="rearrange-button"]'

    # Check their positions after rearranging
    Then I expect component ".id_1.component .model" to be at position 30,30
    And  I expect component ".id_2.component .model" to be at position 30,130
    And  I expect component ".id_3.component .model" to be at position 130,30

    ## 501 When I rename a component (external) id, it is updated in the draw area
    When I click on '.id_1.component .menu-button'
    And  I click on '[data-cy="edit-button"]'
    Then I expect '[data-cy="object-details-panel"]' exists

    When I set on '[data-cy="component-id-input"]' text 'aws_ami_2'
    Then I expect '.id_1.component .model text' is 'aws_ami_2'
    And  I expect '.id_1.component' exists

    ## 601 Delete component should hide detail panel
    # Open component detail panel
    When I click on '.id_3.component .menu-button'
    And  I click on '[data-cy="edit-button"]'
    And  I wait 1 second
    Then I expect '[data-cy="object-details-panel"]' exists

    # Remove component
    When I force click on '.id_3.component .menu-button'
    And  I click on '[data-cy="delete-button"]'
    And  I wait 1 second
    Then I expect '[data-cy="object-details-panel"]' not exists
    And  I expect '.id_3.component' not exists

    # TODO: Uncomment when following bug will be fixed (https://github.com/ditrit/@ditrit/terrator-plugin/issues/98)
    # ## 701 Add variables inside component parsable files should display it on the variables tab inside modelizer draw left drawer
    # # Go to Text page
    # When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    # And  I wait 1 second
    # Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=@ditrit/terrator-plugin&path={{ diagramFolder }}'
    # And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    # And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/{{ diagramFolder }}"]' exists
    # And  I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ diagramFile }}"]' exists

    # # Add two variables with same category to main_variable.tf
    # When I set active file content to 'variable "instance_class" {} variable "instance_var" { value = var }'
    # And  I wait 2 seconds

    # # Create new file named variable.tf
    # And  I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}"]' to make it visible
    # And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ diagramFolder }}"]'
    # And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    # Then I expect '[data-cy="create-file-dialog"]' exists

    # When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'variable.tf'
    # And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    # Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    # And  I expect '[data-cy="create-file-form"]' is closed

    # When I wait 2 seconds
    # Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'variable.tf'
    # And  I expect '[data-cy="file_{{ projectName }}/{{ diagramFolder }}/variable.tf"].file-status-untracked' exists

    # # Add two variables with different category to infra/variable.tf file
    # When I set active file content to 'output "instance_ip" { value = aws_instance.server } variable "instance_test" { value = test }'
    # And  I wait 2 seconds

    # # Go to Draw page
    # And  I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    # And  I wait 2 seconds
    # Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path={{ diagramFolder }}'
    # And  I expect '[data-cy="draw-page-left-drawer"]' exists
    # And  I expect '[data-cy="draw-page-variables-tab"]' exists

    # # Check both variables inside main.tf
    # When I click on '[data-cy="draw-page-variables-tab"]'
    # Then I expect '[data-cy="variable-list"]' exists
    # And  I expect '[data-cy="variable-item_{{ diagramFile }}"]' exists
    # And  I expect '[data-cy="variable-item_{{ diagramFile }}_variable"]' exists
    # And  I expect '[data-cy="name_instance_class"]' exists
    # And  I expect '[data-cy="value_null"]' exists
    # And  I expect '[data-cy="name_instance_var"]' exists
    # And  I expect '[data-cy="value_var"]' exists

    # # Check both variables inside variable.tf
    # And  I expect '[data-cy="variable-item_{{ diagramFolder }}/variable.tf"]' exists
    # And  I expect '[data-cy="variable-item_{{ diagramFolder }}/variable.tf_output"]' exists
    # And  I expect '[data-cy="name_instance_ip"]' exists
    # And  I expect '[data-cy="value_aws_instance.server"]' exists
    # And  I expect '[data-cy="variable-item_{{ diagramFolder }}/variable.tf_variable"]' exists
    # And  I expect '[data-cy="name_instance_test"]' exists
    # And  I expect '[data-cy="value_test"]' exists

    ### Setup for following tests
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    Then I expect '[data-cy="component-definitions-item_@ditrit/terrator-plugin"] [data-cy="title"]' is 'Terraform (35)'

    ## 801 Template should appear in component definitions list
    And  I expect '[data-cy="component-definitions-item_Templates"]' exists
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates'

    ## 802 Should have only one templates library installed with all these definitions
    When I click on '[data-cy="component-definitions-item_Templates"]'
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definitions-item_Templates"].selected [data-cy="title"]' is 'Templates (2)'
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen
    And  I expect '[data-cy="component-definition_Aws provider"]' exists
    And  I expect '[data-cy="component-definition_Test application"]' exists

    ## 901 Set text as 'Aws provider' should display only one element inside template title
    When I set on '[data-cy="definitions-filter-input"]' text 'Aws provider'
    Then I expect '[data-cy="component-definitions-item_Templates"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates (1)'

    ## 902 Set text as 'bad' should not display template
    When I set on '[data-cy="definitions-filter-input"]' text 'bad'
    Then I expect '[data-cy="component-definitions-item_Templates"]' appear 0 time on screen
    But  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    # Initial state
    When I set on '[data-cy="definitions-filter-input"]' text ''

    ## 903 Select template and set text as 'Aws provider' should display only one element
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text 'Aws provider'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"].selected [data-cy="title"]' is 'Templates (1)'
    And  I expect '[data-cy="component-definition_Aws provider"]' exists

    # Initial state
    When I set on '[data-cy="definitions-filter-input"]' text ''

    ## 904 Select template and set text as 'bad' should not display any elements
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text 'bad'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 0 time on screen
    And  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    ## 905 Set text as 'Aws provider' then select templates library should display only one element
    When I set on '[data-cy="definitions-filter-input"]' text 'Aws provider'
    Then I expect '[data-cy="component-definitions-item_Templates"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates (1)'
    And  I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definitions-item_Templates"].selected [data-cy="title"]' is 'Templates (1)'
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definition_Aws provider"]' exists

    # Initial state
    When I set on '[data-cy="definitions-filter-input"]' text ''
    Then I expect '[data-cy="component-definitions-item_Templates"].selected [data-cy="title"]' is 'Templates (2)'

    ## 1001 Click on the Test application component should display it on the page
    And  I expect '.id_3.component' not exists
    And  I expect '.id_4.component' not exists
    And  I expect '.id_5.component' not exists
    And  I expect '.id_3_to_id_4.link' not exists

    When I click on '[data-cy="component-definition_Test application"]'
    And  I wait 1 second
    Then I expect '.id_3.component' exists
    And  I expect '.id_4.component' exists
    And  I expect '.id_5.component' exists
    And  I expect '.id_3_to_id_4.link' exists
