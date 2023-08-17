Feature: Test modelizer page: default functionalities

  Scenario: Clicking on application logo should redirect to homepage
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect current url is 'projectName/models'

    When I click on '[data-cy="navigation-bar"] [data-cy="home-page-link"]'
    Then I expect current url is '/'
