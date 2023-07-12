Feature: Test home page: open project

  Background:
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'projectTest'
    And   I visit the '/'
    And   I click on '[data-cy="create-project-button"]'
    And   I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And   I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    And   I wait 1 second

    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'

  Scenario: Click on project card in projects list should redirect to 'models' page
    Then I expect '[data-cy="project-card_{{ projectName }}"]' exists
    And  I expect '[data-cy="project-card_{{ projectName }}"] [data-cy="title-container"]' is '{{ projectName }}'

    When I click on '[data-cy="project-card_{{ projectName }}"]'
    Then I expect current url is '{{ projectName }}/models'

  Scenario: Click on project item in left drawer should redirect to 'models' page
    Then I expect '[data-cy="home-drawer"]' exists
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ projectName }}"]' exists
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ projectName }}"]' is '{{ projectName }}'

    When I click on '[data-cy="project-expansion-item"] [data-cy="item_{{ projectName }}"]'
    Then I expect current url is '{{ projectName }}/models'
