Feature: Test git add remote repository dialog

  Background:
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    When I wait 1 second
    And  I visit the '/#/projects/projectName/modelizer/text?path=""'

  Scenario: Set valid git remote repository in the project should send positive toast
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="project-settings-menu"] [data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/leto-modelizer-project-test'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed

  Scenario: Set bad repository url should display an error
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="project-settings-menu"] [data-cy="item_GitAddRemote"]'
    And  I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'bad'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-add-remote-form"] [role="alert"]' is 'Invalid repository url'

  Scenario: Set empty repository should display an error
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="project-settings-menu"] [data-cy="item_GitAddRemote"]'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect field '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' is ''
    And  I expect '[data-cy="git-add-remote-form"] [role="alert"]' is 'Please type something'

  Scenario: After setting a valid git remote repository, only git authentication menu should be displayed
    When I click on '[data-cy="modelizer-settings-button"]'
    Then I expect '[data-cy="project-settings-menu"]' exists
    And  I expect '[data-cy="project-settings-menu"] [data-cy="item_GitAddRemote"]' exists
    And  I expect '[data-cy="project-settings-menu"] [data-cy="item_GitAuthentication"]' exists

    When I click on '[data-cy="project-settings-menu"] [data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists
    And  I expect field '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' is ''

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/leto-modelizer-project-test'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed

    When I click on '[data-cy="modelizer-settings-button"]'
    Then I expect '[data-cy="project-settings-menu"]' exists
    And  I expect '[data-cy="project-settings-menu"] [data-cy="item_GitAuthentication"]' exists
    But  I expect '[data-cy="project-settings-menu"] [data-cy="item_GitAddRemote"]' not exists

  Scenario: Set git add remote repository should bring up the 'Upload to git' button.
    Given I expect '[data-cy="upload-to-git-button"]' not exists

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="project-settings-menu"] [data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/leto-modelizer-project-test'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' exists
