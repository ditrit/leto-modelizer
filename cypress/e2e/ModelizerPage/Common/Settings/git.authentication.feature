Feature: Test git authentication dialog

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"

    Given I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And  I visit the "/#/modelizer/{{ projectName }}/text"

  Scenario: Set git authentication in the project should send positive toast
    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAuthentication\"]"
    Then I expect "[data-cy=\"git-authentication-form\"]" exists

    When I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-username-input\"]" text "test"
    And  I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-token-input\"]" text "test"
    And  I click on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "Git authentication updated &#129395;!"
    And  I expect "[data-cy=\"git-authentication-form\"]" is closed

  Scenario: Set git authentication then set git add remote repository should keep saved authentication values in each corresponding fields
    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAuthentication\"]"
    Then I expect "[data-cy=\"git-authentication-form\"]" exists

    When I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-username-input\"]" text "test"
    And  I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-token-input\"]" text "test"
    And  I click on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "Git authentication updated &#129395;!"
    And  I expect "[data-cy=\"git-authentication-form\"]" is closed

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAddRemote\"]"
    Then I expect "[data-cy=\"git-add-remote-form\"]" exists

    When I set on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I click on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect "[data-cy=\"git-add-remote-form\"]" is closed
    
    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAuthentication\"]"
    Then I expect field "[data-cy=\"git-authentication-form\"] [data-cy=\"git-username-input\"]" is "test"
    And  I expect field "[data-cy=\"git-authentication-form\"] [data-cy=\"git-token-input\"]" is "test"

  Scenario: Set git add remote repository then set valid git authentication should enable the "Upload to git" button.
    Given I expect "[data-cy=\"upload-to-git-button\"]" not exists

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAddRemote\"]"
    Then I expect "[data-cy=\"git-add-remote-form\"]" exists

    When I set on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I click on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect "[data-cy=\"git-add-remote-form\"]" is closed
    And  I expect "[data-cy=\"upload-to-git-button\"]" exists
    And  I expect "[data-cy=\"upload-to-git-button\"]" to be disabled

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAuthentication\"]"
    Then I expect "[data-cy=\"git-authentication-form\"]" exists

    When I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-username-input\"]" text "test"
    And  I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-token-input\"]" text "test"
    And  I click on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "Git authentication updated &#129395;!"
    And  I expect "[data-cy=\"git-authentication-form\"]" is closed
    And  I expect "[data-cy=\"upload-to-git-button\"]" to be enabled
  
  Scenario: Set git add remote repository then set empty git username should keep the "Upload to git" button disabled.
    Given I expect "[data-cy=\"upload-to-git-button\"]" not exists

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAddRemote\"]"
    Then I expect "[data-cy=\"git-add-remote-form\"]" exists

    When I set on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I click on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect "[data-cy=\"git-add-remote-form\"]" is closed
    And  I expect "[data-cy=\"upload-to-git-button\"]" exists
    And  I expect "[data-cy=\"upload-to-git-button\"]" to be disabled

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAuthentication\"]"
    Then I expect "[data-cy=\"git-authentication-form\"]" exists

    When I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-token-input\"]" text "test"
    And  I click on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "Git authentication updated &#129395;!"
    And  I expect "[data-cy=\"git-authentication-form\"]" is closed
    And  I expect "[data-cy=\"upload-to-git-button\"]" to be disabled

  Scenario: Set git add remote repository then set empty git token should keep the "Upload to git" button disabled.
    Given I expect "[data-cy=\"upload-to-git-button\"]" not exists

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAddRemote\"]"
    Then I expect "[data-cy=\"git-add-remote-form\"]" exists

    When I set on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-repository-input\"]" text "https://github.com/ditrit/leto-modelizer-project-test"
    And  I click on "[data-cy=\"git-add-remote-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "We have access to your repository 🥳!"
    And  I expect "[data-cy=\"git-add-remote-form\"]" is closed
    And  I expect "[data-cy=\"upload-to-git-button\"]" exists
    And  I expect "[data-cy=\"upload-to-git-button\"]" to be disabled

    When I click on "[data-cy=\"project-settings\"]"
    And  I click on "[data-cy=\"git-settings-menu-GitAuthentication\"]"
    Then I expect "[data-cy=\"git-authentication-form\"]" exists

    When I set on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-username-input\"]" text "username"
    And  I click on "[data-cy=\"git-authentication-form\"] [data-cy=\"git-form-submit\"]"
    Then I expect "positive" toast to appear with text "Git authentication updated &#129395;!"
    And  I expect "[data-cy=\"git-authentication-form\"]" is closed
    And  I expect "[data-cy=\"upload-to-git-button\"]" to be disabled
