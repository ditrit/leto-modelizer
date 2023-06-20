Feature: Test models page: filter template in drawer

  Scenario: Should filter templates by plugins and search text
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I set context field 'projectName' with 'projectTest'
    And   I set context field 'modelName' with 'modelTest'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{projectName}}/models'

    # Open drawer and verify all templates are present
    When I click on '[data-cy="add-model-button"]'
    Then I expect '[data-cy="template-card_terraform_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen

    # Set 'java' as searched text and expect only templates that contains 'java' to be displayed
    When I set on '[data-cy="search-template-input"]' text 'java'
    Then I expect '[data-cy="template-card_terraform_webapp"]' not exists
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen

    # Clear filter text and verify all templates are present
    When I set on '[data-cy="search-template-input"]' text ' '
    Then I expect '[data-cy="template-card_terraform_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen

    # Select Githubator-plugin plugin and verify all templates disappear
    When I select '[data-cy="item_githubator-plugin"]' in '[data-cy="plugin-select"]'
    Then I expect '[data-cy="template-card_terraform_webapp"]' not exists
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' not exists

    # Select Terrator-plugin plugin and verify only all terraform templates are present
    When I select '[data-cy="item_terrator-plugin"]' in '[data-cy="plugin-select"]'
    Then I expect '[data-cy="template-card_terraform_webapp"]' appear 1 time on screen
    And  I expect '[data-cy="template-card_terraform_java_webapp"]' appear 1 time on screen
