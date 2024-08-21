Feature: Fix issue #370: Unable to create and use diagram on root folder.

  Scenario: Create diagram on root and navigate inside
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Create first model on root folder
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is 'projectName/modelizer/draw\?plugin=@ditrit/terrator-plugin&path='

    # Add component to verify, file is created.
    When I click on '[data-cy="component-definitions-item_@ditrit/terrator-plugin"]'
    And  I click on '[data-cy="component-definition_aws"]'
    Then I expect '[data-cy="draw-container"]' exists
    And  I expect '[class^="id_1 component"]' exists

    # Go to text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds
    Then I expect current url is 'projectName/modelizer/text\?plugin=@ditrit/terrator-plugin&path='
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_projectName"]' is 'projectName'
    And  I expect '[data-cy="file-explorer"] [data-cy="file_projectName/new_file.tf"]' exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'new_file.tf'
    And  I expect active file content to contain 'provider.*"aws".*{}'

    # Go to project page
    When I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is 'projectName/models'

    # Create another model
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra/main.tf'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is 'projectName/modelizer/draw\?plugin=@ditrit/terrator-plugin&path=infra'

    # Go to text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds
    Then I expect current url is 'projectName/modelizer/text\?plugin=@ditrit/terrator-plugin&path=infra'

    # verify we can switch to root diagram
    When I double click on '[data-cy="file-explorer"] [data-cy="file_projectName/new_file.tf"]'
    Then I expect current url is 'projectName/modelizer/text\?plugin=@ditrit/terrator-plugin&path='
