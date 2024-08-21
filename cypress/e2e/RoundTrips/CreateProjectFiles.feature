Feature: Test roundtrip of the application : create project files

  Scenario Outline: Create project redirect to models page with correct plugin and create project files and folders
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'projectTest'
    And   I visit the '/'
    And   I wait until the application is loaded

    # Create new project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ projectName }}/models'

    # Create new model with correct plugin
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_<plugin>"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '<modelFile>'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Model has been created 🥳!'
    And  I expect current url is '{{ projectName }}/modelizer/draw\?plugin=<plugin>&path=<model>'

    # Check project files and folders are created in Text view
    When I click on '[data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect current url is '{{ projectName }}/modelizer/text\?plugin=<plugin>&path=<model>'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' is '{{ projectName }}'
    And  I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}/<modelFolder>"]' exists

    # Check project is displayed in home page
    When I visit the '/'
    And  I wait until the application is loaded
    Then I expect '[data-cy="project-card_{{ projectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ projectName }}"] [data-cy="title-container"]' is '{{ projectName }}'

    Examples:
      | plugin            | modelFile      | modelFolder       | model                    |
      | @ditrit/terrator-plugin   | model1/main.tf | model1            | model1                   |
      | @ditrit/githubator-plugin | CI.yml         | .github/workflows | .github/workflows/CI.yml |
