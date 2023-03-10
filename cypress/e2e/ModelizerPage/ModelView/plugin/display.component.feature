@skip
# TODO: update/fix test 
Feature: Test modelizer model view: add plugin component

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on '[data-cy="new-project"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="project-name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="new-project-form-submit"]'
    Then I expect current url is "/modelizer/projectName/model"
    And  I expect '[data-cy="plugin-definitions-terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="plugin-definitions-terrator-plugin"] [data-cy="plugin-definitions-title"]' is "terrator-plugin"

    When I click on '[data-cy="plugin-definitions-terrator-plugin"]'
    Then I expect '[class*="component-definition-card"]' appear 18 times on screen

  Scenario Outline: Click on the <element> component should display it on the page
    Then I expect '[data-cy="modelizer-model-view-draw-root"] [id^="<element>"]' not exists

    When I click on '[data-cy="component-definition-<element>"]'
    Then I expect '[data-cy="modelizer-model-view-draw-root"] [id^="<element>"]' exists
    And  I expect '[data-cy="modelizer-model-view-draw-root"] [id^="<element>"]' appear 1 time on screen

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

  Scenario Outline: Dragging the <element> component should display it on the page
    Then I expect '[data-cy="modelizer-model-view-draw-root"] [id^="<element>_"]' not exists

    When I drag '[data-cy="component-definition-<element>"]' onto '[data-cy="modelizer-model-view-draw-root"]'
    Then I expect '[data-cy="modelizer-model-view-draw-root"] [id^="<element>_"]' exists
    And  I expect '[data-cy="modelizer-model-view-draw-root"] [id^="<element>_"]' appear 1 time on screen

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
