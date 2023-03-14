@skip
# TODO: update/fix test
Feature: Test modelizer model view: plugin initialization

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text "projectName"
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is "/modelizer/projectName/model"

  Scenario Outline: Set text as "<filter>" should display only one element
    When I click on '[data-cy="component-defnitions-item_terrator-plugin"]'
    Then I expect '[class*="plugin-definitions"]' appear 1 time on screen
    And  I expect '[class*="component-definition-card"]' appear 18 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text "<filter>"
    And  I expect '[class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definition_<filter>"]' exists

    Examples:
      | filter                |
      | aws_ami               |
      | server                |
      | aws_security_group    |
      | aws_instance          |
      | aws_volume_attachment |
      | aws_ebs_volume        |
      | aws_elb               |
      | aws_vpc               |
      | aws_internet_gateway  |
      | aws_subnet            |
      | aws_db_subnet_group   |
      | aws_route53_zone      |
      | aws_route53_record    |
      | aws_db_instance       |
      | aws_key_pair          |

  Scenario Outline: Set text as "<filter>" should display only two elements
    When I click on '[data-cy="component-defnitions-item_terrator-plugin"]'
    Then I expect '[class*="plugin-definitions"]' appear 1 time on screen
    And  I expect '[class*="component-definition-card"]' appear 18 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text "<filter>"
    And  I expect '[class*="component-definition-card"]' appear 2 times on screen
    And  I expect '[data-cy="component-definition_<element1>"]' exists
    And  I expect '[data-cy="component-definition_<element2>"]' exists

    Examples:
      | filter       | element1              | element2             |
      | ami server   | aws_ami               | server               |
      | security elb | aws_security_group    | aws_elb              |
      | vpc internet | aws_vpc               | aws_internet_gateway |
      | instance     | aws_instance          | aws_db_instance      |
      | volume       | aws_volume_attachment | aws_ebs_volume       |
      | subnet       | aws_subnet            | aws_db_subnet_group  |
      | route53      | aws_route53_zone      | aws_route53_record   |

  Scenario Outline: Set text as "<filter>" should not display any elements.
    When I click on '[data-cy="component-defnitions-item_terrator-plugin"]'
    Then I expect '[class*="plugin-definitions"]' appear 1 time on screen
    And  I expect '[class*="component-definition-card"]' appear 18 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text "<filter>"
    And  I expect '[class*="component-definition-card"]' appear 0 time on screen
    Examples:
      | filter    |
      | bad       |
      | amiserver |
