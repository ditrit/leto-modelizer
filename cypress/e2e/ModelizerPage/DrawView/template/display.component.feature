Feature: Test modelizer draw view: add template component

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
    And  I expect '[data-cy="component-definitions-item_Templates"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_Templates"] [data-cy="title"]' is 'Templates'

    # Select 'Templates' library
    When I click on '[data-cy="component-definitions-item_Templates"]'
    And  I wait 1 second
    Then I expect '[data-cy="component-definitions-item_Templates"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen

  Scenario Outline: Click on the Test application component should display it on the page
    Then I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="SecurityGroup_"]' not exists
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="InternetGateway_"]' not exists
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="VPC_"]' not exists
    And  I expect '[class="link"]' not exists

    When I click on '[data-cy="component-definition_Test application"]'
    And  I wait 1 second
    Then I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="SecurityGroup_"]' exists
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="InternetGateway_"]' exists
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="VPC_"]' exists
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="VPC_"]' exists
    And  I expect '[class="link"]' exists
      
  @skip
  # TODO: update/fix test 
  Scenario Outline: Dragging the <element> component should display it on the page
    Then I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="<element>_"]' not exists

    When I drag '[data-cy="component-definition_<element>"]' onto '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]'
    And  I wait 1 second
    Then I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="<element>"]' exists
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"] [id^="<element>"]' appear 1 time on screen

    Examples:
      | element          |
      | Aws provider     |
      | Test application |
