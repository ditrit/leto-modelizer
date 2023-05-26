Feature: Test home page: project filter

  Scenario: Select/unselect tag should filter the projects list
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'localProjectName' with 'projectTest'
    And   I set context field 'remoteProjectName' with 'leto-modelizer-project-test'
    And   I set context field 'remoteProjectUrl' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I visit the '/'

    # Create a local project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{localProjectName}}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{localProjectName}}/models'

    # Go back to HomePage
    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    # Create a remote project
    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ remoteProjectUrl }}'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'
    And  I expect current url is '{{remoteProjectName}}/models'

    # Go back to HomePage
    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    # Verify all project tags are inactive
    And  I expect '[data-cy="inactive-tag_local"]' exists
    And  I expect '[data-cy="inactive-tag_remote"]' exists

    # Select local tag and verify only local projects are displayed
    When I click on '[data-cy="inactive-tag_local"]'
    Then I expect '[data-cy="inactive-tag_local"]' not exists
    And  I expect '[data-cy="active-tag_local"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' not exists
    And  I expect '[data-cy="project-card_{{localProjectName}}"]' appear 1 time on screen

    # Select the remote tag and check that no project is present
    When I click on '[data-cy="inactive-tag_remote"]'
    Then I expect '[data-cy="inactive-tag_remote"]' not exists
    And  I expect '[data-cy="active-tag_remote"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' not exists
    And  I expect '[data-cy="project-card_{{localProjectName}}"]' not exists

    # Unselect local tag and verify only remote projects are displayed
    When I click on '[data-cy="active-tag_local"]'
    Then I expect '[data-cy="active-tag_local"]' not exists
    And  I expect '[data-cy="inactive-tag_local"]' exists
    And  I expect '[data-cy="project-card_{{remoteProjectName}}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{localProjectName}}"]' not exists
