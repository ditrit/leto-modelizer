Feature: Test modelizer draw view: add plugin component

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

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infra'
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    # Select 'terrator-plugin' library
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 18 times on screen

  Scenario Outline: Click on the <element> component should display it on the page
    Then I expect '[data-cy="draw-container"] [id^="<element>"]' not exists

    When I click on '[data-cy="component-definition_<element>"]'
    And  I wait 1 second
    Then I expect '[data-cy="draw-container"] [id^="<element>"]' exists
    And  I expect '[data-cy="draw-container"] [id^="<element>"]' appear 1 time on screen

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

  @skip
  # TODO: update/fix test
  Scenario Outline: Dragging the <element> component should display it on the page
    Then I expect '[data-cy="draw-container"] [id^="<element>_"]' not exists

    When I drag '[data-cy="component-definition_<element>"]' onto '[data-cy="draw-container"]'
    And  I wait 1 second
    Then I expect '[data-cy="draw-container"] [id^="<element>"]' exists
    And  I expect '[data-cy="draw-container"] [id^="<element>"]' appear 1 time on screen

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
