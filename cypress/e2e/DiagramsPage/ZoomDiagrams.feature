@skip
Feature: Test diagrams page: zoom on all diagrams
  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelFile' with 'infra/main.tf'
    And   I set context field 'modelFolder' with 'infra'

    # Project creation
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # First model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 2 seconds
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=terrator-plugin&path={{ modelFolder }}'
    And  I expect '[data-cy="component-definitions-list"]' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin'

    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    Then I expect '[data-cy="draw-container"]' exists
    And  I expect '[id^="aws"]' exists

    # Back to the diagrams page
    When I visit the 'localhost:8080/#/projects/{{ projectName }}/diagrams'
    And  I wait 2 seconds
    And  I expect '[id="svg-aws_1"]' exists
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' exists

  Scenario: Should zoom +.5 on all diagrams
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 278
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 212

    When I click on '[data-cy="zoom-plus-button"]'
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 417
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 318

  Scenario: Should zoom -.5 on all diagrams
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 278
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 212

    When I click on '[data-cy="zoom-minus-button"]'
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 139
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 106

  Scenario: Should zoom /2 on all diagrams
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 278
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 212

    When I click on '[data-cy="zoom-minus-button"]'
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 139
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 106

    When I click on '[data-cy="zoom-minus-button"]'
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 69
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 53

  Scenario: Should zoom x2 on all diagrams
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 278
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 212

    When I click on '[data-cy="zoom-minus-button"]'
    And  I click on '[data-cy="zoom-minus-button"]'
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 69
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 53

    When I click on '[data-cy="zoom-plus-button"]'
    Then I expect '[data-cy="diagram_{{ modelFolder }}"]' width is 139
    And  I expect '[data-cy="diagram_{{ modelFolder }}"]' height is 106
