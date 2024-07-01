Feature: Fix issue #390: (Link|Reference)Input options are not updated

  Scenario: Create (Link|Reference) components update componentDetailsPanel input options
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    # Create project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Create model
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infraFirst'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infraFirst'

    # Create one link option & one ref option
    When I click on '[data-cy="component-definitions-item_terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws_route53_zone"]'
    And  I click on '[data-cy="component-definition_aws_route53_record"]'
    Then I expect '[class^="id_1 component"]' appear 1 time on screen
    And  I expect '[class^="id_2 component"]' appear 1 time on screen

    # Check only one link to component option exists
    When I click on '.id_1.component .menu-button'
    Then I expect '[data-cy="add-link-button"]' exists

    When I click on '[data-cy="add-link-button"]'
    Then I expect '[data-cy="link-to-component-id_2-button"]' exists
    And  I click on '[data-cy="link-to-component-id_2-button"]'

    # Create second link option
    When I click on '[data-cy="component-definition_aws_route53_record"]'
    Then I expect '[class^="id_2 component"]' appear 1 time on screen
    And  I expect '[class^="id_3 component"]' appear 1 time on screen

    # Check two link options exist
    When I click on '.id_1.component .menu-button'
    Then I expect '[data-cy="add-link-button"]' exists

    When I click on '[data-cy="add-link-button"]'
    Then I expect '[data-cy="link-to-component-id_2-button"]' exists
    And  I expect '[data-cy="link-to-component-id_3-button"]' exists
    And  I click on '[data-cy="link-to-component-id_2-button"]'

    # Check only one ref option exists
    When I click on '.id_1.component .menu-button'
    And I click on '[data-cy="add-link-button"]'
    Then I expect '[data-cy="link-to-definition-aws_route53_record-button"]' exists
