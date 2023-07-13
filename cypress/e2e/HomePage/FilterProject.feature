Feature: Test home page: project filter

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'localProjectName' with 'projectLocal'
    And   I set context field 'remoteProjectName' with 'leto-modelizer-project-test'
    And   I set context field 'remoteProjectUrl' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I visit the '/'

    # Create a local project
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ localProjectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ localProjectName }}/models'
    And  I wait 1 second

    # Go back to HomePage
    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

    # Create a remote project
    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ remoteProjectUrl }}'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'
    And  I expect current url is '{{ remoteProjectName }}/models'
    And  I wait 1 second

    # Go back to HomePage
    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

  #Scenario: Select/unselect tag should filter the projects list
  #  # Verify all project tags are inactive
  #  And  I expect '[data-cy="inactive-tag_local"]' exists
  #  And  I expect '[data-cy="inactive-tag_remote"]' exists

    # Select local tag and verify only local projects are displayed
    When I click on '[data-cy="inactive-tag_local"]'
    Then I expect '[data-cy="inactive-tag_local"]' not exists
    And  I expect '[data-cy="active-tag_local"]' exists
    And  I expect '[data-cy="project-card_{{ remoteProjectName }}"]' not exists
    And  I expect '[data-cy="project-card_{{ localProjectName }}"]' appear 1 time on screen

    # Select the remote tag and check that no project is present
    When I click on '[data-cy="inactive-tag_remote"]'
    Then I expect '[data-cy="inactive-tag_remote"]' not exists
    And  I expect '[data-cy="active-tag_remote"]' exists
    And  I expect '[data-cy="project-card_{{ remoteProjectName }}"]' not exists
    And  I expect '[data-cy="project-card_{{ localProjectName }}"]' not exists

    # Unselect local tag and verify only remote projects are displayed
    When I click on '[data-cy="active-tag_local"]'
    Then I expect '[data-cy="active-tag_local"]' not exists
    And  I expect '[data-cy="inactive-tag_local"]' exists
    And  I expect '[data-cy="project-card_{{ remoteProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ localProjectName }}"]' not exists

  #Scenario: Set/unset searched text should filter the projects list
  #  # Verify all project tags are inactive
  #  And  I expect '[data-cy="inactive-tag_local"]' exists
  #  And  I expect '[data-cy="inactive-tag_remote"]' exists

    # Set 'local' as searched text and expect only projects that contains 'local' to be displayed
    When I set on '[data-cy="search-project-input"]' text 'local'
    Then I expect '[data-cy="project-card_{{ remoteProjectName }}"]' not exists
    And  I expect '[data-cy="project-card_{{ localProjectName }}"]' appear 1 time on screen

    # Set 'leto' as searched text and expect only projects that contains 'leto' to be displayed
    When I set on '[data-cy="search-project-input"]' text 'leto'
    Then I expect '[data-cy="project-card_{{ localProjectName }}"]' not exists
    And  I expect '[data-cy="project-card_{{ remoteProjectName }}"]' appear 1 time on screen

    # Set 'none' as searched text and expect no project is displayed
    When I set on '[data-cy="search-project-input"]' text 'none'
    Then I expect '[data-cy="project-card_{{ localProjectName }}"]' not exists
    And  I expect '[data-cy="project-card_{{ remoteProjectName }}"]' not exists

    # Set 'leto local' as searched text and expect all projects are displayed
    When I set on '[data-cy="search-project-input"]' text 'leto local'
    Then I expect '[data-cy="project-card_{{ localProjectName }}"]' exists
    And  I expect '[data-cy="project-card_{{ remoteProjectName }}"]' exists

    # Unset searched text and expect all projects are displayed
    When I set on '[data-cy="search-project-input"]' text ' '
    Then I expect '[data-cy="project-card_{{ localProjectName }}"]' exists
    And  I expect '[data-cy="project-card_{{ remoteProjectName }}"]' exists
