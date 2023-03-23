Feature: Test modelizer model view: plugin initialization

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

  Scenario: Plugin test should appear in component definitions list
    Then I expect '[data-cy="component-defnitions-item_terrator-plugin"]' exists
    And  I expect '[data-cy="component-defnitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

  Scenario: Should have only one plugin installed with all these definitions
    When I click on '[data-cy="component-defnitions-item_terrator-plugin"]'
    Then I expect '[class*="plugin-definitions"]' appear 1 time on screen
    And  I expect '[data-cy="component-defnitions-item_terrator-plugin"] [class*="component-definition-card"]' appear 18 times on screen
    And  I expect '[data-cy="component-definition_<element>"]' exists

    Examples:
      | element               |
      | aws                   |
      | aws_ami               |
      | server                |
      | aws_security_group    |
      | aws_instance          |
      | aws_volume_attachment |
      | aws_ebs_volume        |
      | aws_elb               |
      | aws_vpc               |
      | aws_internet_gateway  |
      | aws_route             |
      | aws_subnet            |
      | aws_db_subnet_group   |
      | aws_route53_zone      |
      | aws_route53_record    |
      | aws_db_instance       |
      | aws_key_pair          |
