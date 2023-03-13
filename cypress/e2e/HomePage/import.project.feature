Feature: Test homepage: project import

  Scenario: Import project should redirect to project model view page
    Given I clear cache
    And  I set context field "repository_url" with "https://github.com/ditrit/leto-modelizer-project-test"
    And  I set context field "projectName" with "leto-modelizer-project-test"
    And  I visit the "/"

    When I click on '[data-cy="import-project"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text "{{ repository_url }}"
    And  I set on '[data-cy="import-project-form"] [data-cy="username-input"]' text "test"
    And  I set on '[data-cy="import-project-form"] [data-cy="token-input"]' text "test"
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect "positive" toast to appear with text "Project has been imported 🥳!"
    And  I expect '[data-cy="import-project-form"]' is closed
    And  I expect current url is "modelizer/{{ projectName }}/model"
    And  I expect '[data-cy="project-name"]' is "{{ projectName }}"
