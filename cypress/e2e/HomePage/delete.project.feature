Feature: Test homepage: project deletion

  Background:
    Given I clear cache
    And  I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And  I visit the "/"

  Scenario: Delete existing project
    When I click on '[data-cy="new-project"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="project-name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="new-project-form-submit"]'
    Then I expect current url is "modelizer/projectName/model"

    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is "/"

    When I click on '[data-cy="delete-project-projectName"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="confirm-delete-project-checkbox"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="delete-project-form-submit"]'
    Then I expect "positive" toast to appear with text "Project has been deleted 😥"
    And  I expect '[data-cy="delete-project-form"]' is closed
    And  I expect '[data-cy="project-card"]' not exists

  Scenario: Delete project should remove it from database
    Given I set context field "projectName" with "leto-modelizer-project-test"
    When I click on '[data-cy="import-project"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="git-repository-input"]' text "{{ repository_url }}"
    And  I set on '[data-cy="import-project-form"] [data-cy="git-username-input"]' text "test"
    And  I set on '[data-cy="import-project-form"] [data-cy="git-token-input"]' text "test"
    And  I click on '[data-cy="import-project-form"] [data-cy="import-project-form-submit"]'
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And  I expect '[data-cy="import-project-form"]' is closed
    And  I expect current url is "modelizer/{{ projectName }}/model"

    When I visit the "/#/modelizer/{{ projectName }}/text"
    Then I expect '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]' exists
    And  I wait 1 second

    When I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'
    And  I hover '[data-cy="file-explorer"] [data-cy="file-explorer-buttons-branch.txt"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-explorer-buttons-branch.txt"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-menu-delete-file"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="delete-file-submit"]'
    Then I expect "positive" toast to appear with text "File is deleted."
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file-label-branch.txt.js"]' not exists

    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is "/"

    When I click on '[data-cy="delete-project-{{ projectName }}"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="confirm-delete-project-checkbox"]'
    And  I click on '[data-cy="delete-project-form"] [data-cy="delete-project-form-submit"]'
    Then I expect "positive" toast to appear with text "Project has been deleted 😥"
    And  I expect '[data-cy="delete-project-form"]' is closed
    And  I expect '[data-cy="project-card"]' not exists

    When I click on '[data-cy="import-project"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="git-repository-input"]' text "{{ repository_url }}"
    And  I set on '[data-cy="import-project-form"] [data-cy="git-username-input"]' text "test"
    And  I set on '[data-cy="import-project-form"] [data-cy="git-token-input"]' text "test"
    And  I click on '[data-cy="import-project-form"] [data-cy="import-project-form-submit"]'
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And  I expect '[data-cy="import-project-form"]' is closed
    And  I expect current url is "modelizer/{{ projectName }}/model"

    When I visit the "/#/modelizer/{{projectName}}/text"
    Then I expect '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}\"]' exists
    And  I wait 1 second

    When I click on '[data-cy="file-explorer"] [data-cy="file-label-{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-branch.txt"]' exists
