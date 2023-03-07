Feature: Test home page: project creation

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'projectTest'
    And   I visit the '/'

  Scenario: Home page should display an empty project message and one template project card
    Then I expect '[data-cy="project-grid-empty"]' exists
    And  I expect '[data-cy="project-grid-empty"]' is 'No projects, please create a new project to have one here 😉'
    And  I expect '[data-cy="template-card_project_template"]' exists
    And  I expect '[data-cy="template-card_project_template"] [data-cy="title-container"]' is 'Project template'

  Scenario: Create project should redirect to models page and send positive toast
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is 'modelizer/{{projectName}}/models'

  Scenario: Create project should add the project in Home page
    Given I click on '[data-cy="create-project-button"]'
    And   I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And   I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'

    When I visit the '/'
    Then I expect '[data-cy="project-card_{{projectName}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{projectName}}"] [data-cy="title-container"]' is '{{projectName}}'

  Scenario: Create project with empty name should display an error
    When I click on '[data-cy="create-project-button"]'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-form"] [role="alert"]' is 'Please type something'

  Scenario: Create project with an already existing project name should display an error
    Given I click on '[data-cy="create-project-button"]'
    And   I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And   I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'

    When I visit the '/'
    And  I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-form"] [role="alert"]' is 'Project name already exists.'

  Scenario: Create project from a template should redirect to models page and send positive toast
    When I click on '[data-cy="template-card_project_template"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is 'modelizer/{{projectName}}/models'

  Scenario: Create project from a template should add the project in Home page
    Then I expect '[data-cy="template-card_project_template"]' exists

    When I click on '[data-cy="template-card_project_template"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    And  I visit the '/'
    Then I expect '[data-cy="project-card_{{projectName}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{projectName}}"] [data-cy="title-container"]' is '{{projectName}}'

  Scenario: Create project from a template with empty name should display an error
    Then I expect '[data-cy="template-card_project_template"]' exists

    When I click on '[data-cy="template-card_project_template"]'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-template-form"] [role="alert"]' is 'Please type something'

  Scenario: Create project from a template with an already existing project name should display an error
    Then I expect '[data-cy="template-card_project_template"]' exists

    When I click on '[data-cy="template-card_project_template"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    And  I visit the '/'
    And  I click on '[data-cy="template-card_project_template"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{projectName}}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-template-form"] [role="alert"]' is 'Project name already exists.'
