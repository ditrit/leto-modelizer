Feature: Fix issue #370: Wrong files opened when I switch to text view if multiple diagrams have the same name prefix

  Scenario: Create two projects with one containing the name of the other
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Create first model
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infraFirst'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infraFirst'

    # Create second model
    When I click on '[data-cy="models-page-link-button"]'
    And  I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path=infra'

    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' appear 0 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="file_infra/new_file.tf"]' appear 1 time on screen
