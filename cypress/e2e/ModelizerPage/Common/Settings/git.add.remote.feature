Feature: Test git add remote repository dialog

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on '[data-cy="new-project"]'
    And  I set on '[data-cy="new-project-form"] [data-cy="project-name-input"]' text "projectName"
    And  I click on '[data-cy="new-project-form"] [data-cy="new-project-form-submit"]'
    Then I expect current url is "/modelizer/projectName/model"

    When I visit the "/#/modelizer/projectName/text"

  Scenario: Set valid git remote repository in the project should send positive toast
    When I click on '[data-cy="project-settings"]'
    And  I click on '[data-cy="git-settings-menu-GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="git-repository-input"]' text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="git-form-submit"]'
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect '[data-cy="git-add-remote-form"]' is closed

  Scenario: Set bad repository url should display an error
    When I click on '[data-cy="project-settings"]'
    And  I click on '[data-cy="git-settings-menu-GitAddRemote"]'
    And  I set on '[data-cy="git-add-remote-form"] [data-cy="git-repository-input"]' text "bad"
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="git-form-submit"]'
    Then I expect '[data-cy="git-add-remote-form"] [role="alert"]' is "Invalid repository url"

  Scenario: Set empty repository should display an error
    When I click on '[data-cy="project-settings"]'
    And  I click on '[data-cy="git-settings-menu-GitAddRemote"]'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="git-form-submit"]'
    Then I expect field '[data-cy="git-add-remote-form"] [data-cy="git-repository-input"]' is ""
    And  I expect '[data-cy="git-add-remote-form"] [role="alert"]' is "Please type something"

  Scenario: After setting a valid git remote repository, only git authentication menu should be displayed
    When I click on '[data-cy="project-settings"]'
    Then I expect '[data-cy="project-settings-menu"]' exists
    And  I expect '[data-cy="git-settings-menu-GitAddRemote"]' exists
    And  I expect '[data-cy="git-settings-menu-GitAuthentication"]' exists

    When I click on '[data-cy="git-settings-menu-GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists
    And  I expect field '[data-cy="git-add-remote-form"] [data-cy="git-repository-input"]' is ""

    When I set on '[data-cy="git-add-remote-form"] [data-cy="git-repository-input"]' text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="git-form-submit"]'
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect '[data-cy="git-add-remote-form"]' is closed

    When I click on '[data-cy="project-settings"]'
    Then I expect '[data-cy="project-settings-menu"]' exists
    And  I expect '[data-cy="git-settings-menu-GitAuthentication"]' exists
    But  I expect '[data-cy="git-settings-menu-GitAddRemote"]' not exists

  Scenario: Set git add remote repository should bring up the "Upload to git" button.
    Given I expect '[data-cy="upload-to-git-button"]' not exists

    When I click on '[data-cy="project-settings"]'
    And  I click on '[data-cy="git-settings-menu-GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="git-repository-input"]' text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="git-form-submit"]'
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect '[data-cy="git-add-remote-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' exists
