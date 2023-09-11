Feature: Test git authentication dialog

  Background:
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I set context field 'firstModelFile' with 'model1/main.tf'
    And   I set context field 'firstModelFolder' with 'model1'
    And   I visit the '/'
    And   I wait until the application is loaded

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    When  I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ firstModelFile }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?plugin=terrator-plugin&path={{ firstModelFolder }}'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second

  Scenario: Set git authentication in the project should send positive toast
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-form"] [data-cy="username-input"]' text 'test'
    And  I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed

  Scenario: Set git authentication then set git add remote repository should keep saved authentication values in each corresponding fields
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-form"] [data-cy="username-input"]' text 'test'
    And  I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/leto-modelizer-project-test'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect field '[data-cy="git-authentication-form"] [data-cy="username-input"]' is 'test'
    And  I expect field '[data-cy="git-authentication-form"] [data-cy="token-input"]' is 'test'

  Scenario: Set git add remote repository then set valid git authentication should enable the 'Upload to git' button.
    Given I expect '[data-cy="upload-to-git-button"]' not exists

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/leto-modelizer-project-test'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' exists
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-form"] [data-cy="username-input"]' text 'test'
    And  I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' to be enabled

  Scenario: Set git add remote repository then set empty git username should keep the 'Upload to git' button disabled.
    Given I expect '[data-cy="upload-to-git-button"]' not exists

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/leto-modelizer-project-test'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' exists
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled

  Scenario: Set git add remote repository then set empty git token should keep the 'Upload to git' button disabled.
    Given I expect '[data-cy="upload-to-git-button"]' not exists

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/leto-modelizer-project-test'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' exists
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-form"] [data-cy="username-input"]' text 'username'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled
