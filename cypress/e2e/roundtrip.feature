Feature: Test roundtrip of the application

  Scenario: Create project, switch and go back to homepage
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Create model
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'modelName'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is 'projectName/modelizer/draw\?path=terrator-plugin/modelName'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Text'
    And  I expect '[data-cy="modelizer-text-view"]' exists
    And  I expect '[data-cy="file-explorer"]' exists
    And  I expect '[data-cy="file-tabs"]' exists
    And  I expect current url is 'projectName/modelizer/text\?path=terrator-plugin/modelName'

    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="true"] [class="block"]' is 'Draw'
    And  I expect '[data-cy="modelizer-draw-view"] [data-cy="draw-container"]' exists
    And  I expect current url is 'projectName/modelizer/draw\?path=terrator-plugin/modelName'

    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    And  I wait 1 second
    Then I expect current url is '/'
    And  I expect '[data-cy="project-card_projectName"]' exists
