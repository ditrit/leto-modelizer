Feature: Test roundtrip of the application: Git

  ################## ImportProject.feature ##################
  ## 101 Import project should redirect to models page and send positive toast
  ## 102 Import project should add it in the projects list
  ## 103 Import project should add it in the left drawer
  ## 104 Import project with empty repository should display an error
  ## 105 Import project with non valid repository should display an error
  ## 106 Import project with non existant repository should display an error
  ## 107 Import project with duplicate repository should display an error
  ## 108 Import project with same repository url with overwrite option should overwrite existing project and send positive toast
  ## 109 Import project with a template should redirect to models page and send positive toast
  ## 110 Import project with a template should add it in the projects list
  ## 111 Import project with a template should add it in the left drawer
  ## 112 Import project with a template with an already existing project name should display an error
  ## 113 Import project with a template with empty repository should display an error
  ## 114 Import project with a template with non valid repository should display an error
  ## 115 Import project with a template with non existant repository should display an error

  ################## GitAddRemote.feature ##################
  ## 201 Set empty repository should display an error
  ## 202 Set bad repository url should display an error
  ## 203 Set valid git remote repository in the project should send positive toast
  ## 204 After setting a valid git remote repository, only git authentication menu should be displayed
  ## 205 Set git add remote repository should bring up the 'Upload to git' button.

  ################## GitAuthentication.feature ##################
  ## 301 Set git add remote repository then set empty git username should keep the 'Upload to git' button disabled.
  ## 302 Set git add remote repository then set empty git token should keep the 'Upload to git' button disabled.
  ## 303 Set git authentication in the project should send positive toast
  ## 304 Set git add remote repository then set valid git authentication should enable the 'Upload to git' button.
  ## 305 Set git authentication then set git add remote repository should keep saved authentication values in each corresponding fields

  ################## DisplayBranch.feature ##################
  ## 401 Default branch should be master
  ## 402 Expect to have master in local branches section

  ################## CreateBranch.feature ##################
  ## 501 Create new branch action with checkout option should create a new branch and checkout on it
  ## 502 Create new branch action without checkout option should create a new branch and not checkout on it

  ################## ChangeBranch.feature ##################
  ## 601 Checkout action should change current branch

  ################## CommonAction.feature ##################
  ## 701 Should check the text of expand branches button

  ################## DisplayLog.feature ##################
  ## 801 Display dialog containing the list of logs

  ################## Commit.feature ##################
  ## 901 Commit with no change
  ## 902 Commit an added file without commit message fails
  ## 903 Commit an added file with commit message succeeds

  ################## DisplayStatus.feature ##################
  ## 1001 Display dialog containing an empty list
  ## 1002 Display file status changes in status dialog

  ################## AddFile.feature ##################
  ## 1101 An unmodified file should not have the 'add' action inside file explorer menu
  ## 1102 Create a file inside the root folder and add it on git should change the file's status
  ## 1103 Create a file inside sub-folder and add it on git should change the file's status

  ################## UpdateFile.feature ##################
  ## 1201 Open a file in root folder and update its content should change the file's class
  ## 1202 Open a file in sub-folder and update its content should change the file's class
  ## 1203 Update a file's content should make the 'add' action available inside file explorer menu

  ################## OpenFile.feature ##################
  ## 1301 Open a file and checkout branch, the file should reload if its panel has changed
  ## 1302 Open two files, checkout branch and if an opened file no longer exists, its corresponding tab should be closed
  ## 1303 Open two files and checkout branch, then the active tab is closed, the other opened tab becomes the active tab

  ################## UpdateBranch.feature ##################
  ## 1401 Update action should be available only for branch that are local and remote
  ## 1402 Execute update action with fast forward should be a success
  ## 1403 Execute update action without fast forward should be a success

  ################## Filterbranch.feature ##################
  ## 1501 Expect to have no branch with 'no_main' filter
  ## 1502 Expect to have main branch with 'main' filter
  ## 1503 Create new branch then check if filter works

  Scenario: Roundtrip about Git
    Given I clear cache
    And   I set viewport size to '1920' px for width and '1080' px for height
    And   I set context field 'projectName' with 'projectName'
    And   I set context field 'importedProjectName' with 'leto-modelizer-project-test'
    And   I set context field 'templateProjectName' with 'leto-modelizer-template-project-test'
    And   I set context field 'testRemoteProjectName' with 'leto-modelizer-project-test-remote'
    And   I set context field 'testAuthenticationProjectName' with 'leto-modelizer-project-test-authentication'
    And   I set context field 'repository_url' with 'https://github.com/ditrit/leto-modelizer-project-test'
    And   I set context field 'modelFolder' with 'infra'
    And   I visit the '/'
    And   I wait until the application is loaded

    ## 101 Import project should redirect to models page and send positive toast
    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'
    And  I expect current url is '{{ importedProjectName }}/models'

    When I wait 1 second
    And  I click on '[data-cy="home-page-link"]'

    ## 102 Import project should add it in the projects list
    Then I expect '[data-cy="project-card_{{ importedProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ importedProjectName }}"] [data-cy="title-container"]' is '{{ importedProjectName }}'

    ## 103 Import project should add it in the left drawer
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ importedProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ importedProjectName }}"]' is '{{ importedProjectName }}'

    ## 104 Import project with empty repository should display an error
    When I click on '[data-cy="import-project-button"]'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="import-project-form"] [role="alert"]' is 'Please type something'

    ## 105 Import project with non valid repository should display an error
    When I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text 'invalidUrl'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="import-project-form"] [role="alert"]' is 'Invalid repository url'

    ## 106 Import project with non existant repository should display an error
    When I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/inexistant'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'warning' toast to appear with text 'Can\'t access the repository.'

    ## 107 Import project with duplicate repository should display an error
    And  I expect '[data-cy="project-card_{{ importedProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ importedProjectName }}"] [data-cy="title-container"]' is '{{ importedProjectName }}'

    # Import another project with same repository url
    When I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="import-project-form"] [role="alert"]' is 'Project already imported.'

    When I click on '[data-cy="close-dialog-button"]'
    And  I click on '[data-cy="project-card_{{ importedProjectName }}"]'

    ## 108 Import project with same repository url with overwrite option should overwrite existing project and send positive toast
    # Modify project
    And  I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    And  I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text '{{ modelFolder }}'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    And  I click on '[data-cy="models-page-link-button"]'
    Then I expect current url is '{{ importedProjectName }}/models'
    And  I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-path_{{ modelFolder }}"]' exists
    And  I expect '[data-cy="diagram-actions_{{ modelFolder }}"]' exists

    When I wait 1 second
    And  I click on '[data-cy="home-page-link"]'
    Then I expect '[data-cy="project-card_{{ importedProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ importedProjectName }}"] [data-cy="title-container"]' is '{{ importedProjectName }}'

    # Import another project with same repository url
    When I click on '[data-cy="import-project-button"]'
    And  I set on '[data-cy="import-project-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="import-project-form"] [data-cy="overwrite-project-checkbox"]'
    And  I click on '[data-cy="import-project-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been imported 🥳!'

    # Check the project has been overwritten
    And  I expect current url is '{{ importedProjectName }}/models'
    And  I expect '[data-cy="diagram-table"]' exists
    And  I expect '[data-cy="diagram-path_{{ modelFolder }}"]' not exists

    # Check the imported project is only displayed once
    When I wait 1 second
    And  I click on '[data-cy="home-page-link"]'
    Then I expect '[data-cy="project-card_{{ importedProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ importedProjectName }}"] [data-cy="title-container"]' is '{{ importedProjectName }}'

    ## 109 Import project with a template should redirect to models page and send positive toast
    When I click on '[data-cy="template-card_Project template"]'
    Then I expect checkbox '[data-cy="create-project-template-form"] [data-cy="import-project-checkbox"]' is not checked

    When I click on '[data-cy="create-project-template-form"] [data-cy="import-project-checkbox"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{ templateProjectName }}'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Project has been created 🥳!'
    And  I expect current url is '{{ templateProjectName }}/models'

    ## 110 Import project with a template should add it in the projects list
    When I wait 1 second
    And  I click on '[data-cy="home-page-link"]'
    Then I expect '[data-cy="project-card_{{ templateProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-card_{{ templateProjectName }}"] [data-cy="title-container"]' is '{{ templateProjectName }}'

    ## 111 Import project with a template should add it in the left drawer
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ templateProjectName }}"]' appear 1 time on screen
    And  I expect '[data-cy="project-expansion-item"] [data-cy="item_{{ templateProjectName }}"]' is '{{ templateProjectName }}'

    ## 112 Import project with a template with an already existing project name should display an error
    # Import another project with the same name
    When I click on '[data-cy="template-card_Project template"]'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="import-project-checkbox"]'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{ templateProjectName }}'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-template-form"] [role="alert"]' is 'Project name already exists.'

    ## 113 Import project with a template with empty repository should display an error
    When I set on '[data-cy="create-project-template-form"] [data-cy="repository-input"]' text ''
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-template-form"] [role="alert"]' is 'Please type something'

    ## 114 Import project with a template with non valid repository should display an error
    When I set on '[data-cy="create-project-template-form"] [data-cy="repository-input"]' text 'invalidUrl'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="create-project-template-form"] [role="alert"]' is 'Invalid repository url'

    ## 115 Import project with a template with non existant repository should display an error
    When I set on '[data-cy="create-project-template-form"] [data-cy="name-input"]' text '{{ templateProjectName }}Two'
    And  I set on '[data-cy="create-project-template-form"] [data-cy="repository-input"]' text 'https://github.com/ditrit/inexistant'
    And  I click on '[data-cy="create-project-template-form"] [data-cy="submit-button"]'
    And  I click on '[data-cy="close-dialog-button"]'
    Then I expect 'warning' toast to appear with text 'Can\'t access the repository.'

    ### Setup for following tests
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ testRemoteProjectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ testRemoteProjectName }}/models'
    And  I expect '[data-cy="upload-to-git-button"]' not exists

    ## 201 Set empty repository should display an error
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect field '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' is ''
    And  I expect '[data-cy="git-add-remote-form"] [role="alert"]' is 'Please type something'

    ## 202 Set bad repository url should display an error
    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text 'bad'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-add-remote-form"] [role="alert"]' is 'Invalid repository url'

    ## 203 Set valid git remote repository in the project should send positive toast
    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed

    ## 204 After setting a valid git remote repository, only git authentication menu should be displayed
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I expect '[data-cy="item_GitAuthentication"]' exists
    But  I expect '[data-cy="item_GitAddRemote"]' not exists

    ## 205 Set git add remote repository should bring up the 'Upload to git' button.
    And  I expect '[data-cy="upload-to-git-button"]' exists
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled

    ## 301 Set git add remote repository then set empty git username should keep the 'Upload to git' button disabled.
    When I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists
    And  I expect field '[data-cy="git-authentication-form"] [data-cy="username-input"]' is ''

    When I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled

    ## 302 Set git add remote repository then set empty git token should keep the 'Upload to git' button disabled.
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-form"] [data-cy="username-input"]' text 'username'
    And  I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text ''
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed
    And  I expect '[data-cy="upload-to-git-button"]' to be disabled

    ## 303 Set git authentication in the project should send positive toast
    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-dialog"] [data-cy="username-input"]' text 'test'
    And  I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed

    ## 304 Set git add remote repository then set valid git authentication should enable the 'Upload to git' button.
    And  I expect '[data-cy="upload-to-git-button"]' exists
    And  I expect '[data-cy="upload-to-git-button"]' to be enabled

    ## 305 Set git authentication then set git add remote repository should keep saved authentication values in each corresponding fields
    And  I click on '[data-cy="home-page-link"]'
    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ testAuthenticationProjectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ testAuthenticationProjectName }}/models'
    And  I expect '[data-cy="upload-to-git-button"]' not exists

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect '[data-cy="git-authentication-form"]' exists

    When I set on '[data-cy="git-authentication-dialog"] [data-cy="username-input"]' text 'test'
    And  I set on '[data-cy="git-authentication-form"] [data-cy="token-input"]' text 'test'
    And  I click on '[data-cy="git-authentication-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'Git authentication updated &#129395;!'
    And  I expect '[data-cy="git-authentication-form"]' is closed

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAddRemote"]'
    Then I expect '[data-cy="git-add-remote-form"]' exists

    When I set on '[data-cy="git-add-remote-form"] [data-cy="repository-input"]' text '{{ repository_url }}'
    And  I click on '[data-cy="git-add-remote-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'We have access to your repository 🥳!'
    And  I expect '[data-cy="git-add-remote-form"]' is closed

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="item_GitAuthentication"]'
    Then I expect field '[data-cy="git-authentication-form"] [data-cy="username-input"]' is 'test'
    And  I expect field '[data-cy="git-authentication-form"] [data-cy="token-input"]' is 'test'

    ### Setup for following tests
    # Back to Home page
    When I click on '[data-cy="close-dialog-button"]'
    And  I click on '[data-cy="home-page-link"]'

    # Project creation
    And  I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text '{{ projectName }}'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/models'

    # Model creation
    When I click on '[data-cy="create-diagram-button"]'
    And  I click on '[data-cy="create-diagram-from-scratch-button"]'
    And  I select '[data-cy="item_@ditrit/terrator-plugin"]' in '[data-cy="create-model-form"] [data-cy="plugin-select"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is '@ditrit/terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'infra'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is '{{ projectName }}/modelizer/draw\?plugin=@ditrit/terrator-plugin&path=infra'

    # Go to Text page
    When I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 1 second
    Then I expect '[data-cy="file-explorer"] [data-cy="folder_{{ projectName }}"]' exists

    ## 401 Default branch should be master
    And  I expect '[data-cy="git-current-branch-button"]' is 'master'

    ## 402 Expect to have master in local branches section
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_master"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_master"] [data-cy="git-menu-current-branch"]' exists

    ## 501 Create new branch action with checkout option should create a new branch and checkout on it
    When I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    Then I expect checkbox '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]' is checked
    And  I expect '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' exists

    When I click on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]'
    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'main'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is created 🥳!'
    And  I expect '[data-cy="git-current-branch-button"]' is 'main'

    ## 502 Create new branch action without checkout option should create a new branch and not checkout on it
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    Then I expect checkbox '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]' is not checked

    When I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'main-two'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is created 🥳!'
    And  I expect '[data-cy="git-current-branch-button"]' is 'main'

    ## 601 Checkout action should change current branch
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main-two"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main-two"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_main-two"]'
    And  I wait 5 seconds
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="checkout-loader_main-two"]' not exists
    And  I expect '[data-cy="git-current-branch-button"]' is 'main-two'

    ## 701 Should check the text of expand branches button
    When I click on '[data-cy="git-current-branch-button"]'

    # Create fourth branch
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    Then I expect '[data-cy="git-new-branch-form"]' exists

    When I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'main-three'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed

    # Create fifth branch
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    And  I expect '[data-cy="git-new-branch-form"]' exists

    And  I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'main-four'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed

    # Create sixth branch
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    Then I expect '[data-cy="git-new-branch-form"]' exists

    When I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'main-five'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed

    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"] [data-cy="expand-list-text"]' is 'Show 1 more...'

    When I click on '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"] [data-cy="expand-list-text"]' is 'Show less'

    When I click on '[data-cy="modelizer-settings-button"]'
    And  I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="expand-local-branch-menu"] [data-cy="expand-list-text"]' is 'Show 1 more...'

    ## 801 Display dialog containing the list of logs
    And  I expect '[data-cy="git-branch-menu"] [data-cy="git-log-item"]' exists

    When I wait 1 second
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' appear 1 time on screen
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' is 'Initial commit'

    When I click on '[data-cy="close-dialog-button"]'

    ## 901 Commit with no change
    And  I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="empty-item"]' exists

    ## 902 Commit an added file without commit message fails
    #  Check list of logs
    When I click on '[data-cy="close-dialog-button"]'
    And  I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' appear 1 time on screen

    When I click on '[data-cy="close-dialog-button"]'
    Then I expect '[data-cy="git-log-dialog"]' not exists

    #  Create a file
    When I hover '[data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'newFile.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/newFile.js"]' appear 1 time on screen
    #  Add file
    When I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/newFile.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/newFile.js"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'
    #  Commit
    And  I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]' exists

    When I click on '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-title"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-file"]' appear 1 time on screen

    #  Empty commit message displays an error
    When I click on '[data-cy="git-commit-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-form"] [role="alert"]' is 'Please type something'

    #  New commit message is not added inside list of logs
    When I click on '[data-cy="close-dialog-button"]'
    And  I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' appear 1 time on screen

    ## 903 Commit an added file with commit message succeeds
    When I click on '[data-cy="close-dialog-button"]'
    Then I expect '[data-cy="git-log-dialog"]' not exists

    #  Commit
    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]' exists

    When I click on '[data-cy="git-branch-menu"] [data-cy="git-commit-item"]'
    Then I expect '[data-cy="git-commit-dialog"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-title"]' exists
    And  I expect '[data-cy="git-commit-dialog"] [data-cy="staged-item-file"]' appear 1 time on screen

    #  Valid commit message displays a successful notification
    When I set on '[data-cy="git-commit-form"] [data-cy="message-input"]' text 'commit'
    And  I click on '[data-cy="git-commit-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-commit-dialog"]' not exists
    And  I expect 'positive' toast to appear with text 'Your files are committed &#129395;!'

    #  New commit message is added inside list of logs
    When I click on '[data-cy="git-current-branch-button"]'
    And  I click on '[data-cy="git-branch-menu"] [data-cy="git-log-item"]'
    Then I expect '[data-cy="git-log-dialog"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"]' exists
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' appear 2 times on screen
    And  I expect '[data-cy="git-log-dialog"] [data-cy="log-list"] [data-cy="item"]' is 'commit'

    When I click on '[data-cy="close-dialog-button"]'

    ## 1001 Display dialog containing an empty list
    # Delete new_file.tf
    And  I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/infra/new_file.tf"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/infra/new_file.tf"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="delete-file-action-item"]'
    Then I expect '[data-cy="delete-file-dialog"]' exists

    When I click on '[data-cy="delete-file-form"] [data-cy="submit-button"]'
    And  I wait 1 second
    Then I expect 'positive' toast to appear with text 'File is deleted.'
    And  I expect '[data-cy="delete-file-form"]' is closed
    And  I expect '[data-cy="file_{{ projectName }}/infra/new_file.tf"]' not exists

    When I click on '[data-cy="git-current-branch-button"]'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="git-status-item"]' exists

    When I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    Then I expect '[data-cy="git-status-dialog"]' exists
    And  I expect '[data-cy="git-status-dialog"] [data-cy="empty-item"]' exists

    When I click on '[data-cy="close-dialog-button"]'

    # TODO: Uncomment when following bug will be fixed (https://github.com/ditrit/leto-modelizer/issues/426)
    # ## 1002 Display file status changes in status dialog
    # #  Create a file
    # And  I hover '[data-cy="folder-button_{{ projectName }}"]' to make it visible
    # And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    # And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    # Then I expect '[data-cy="create-file-dialog"]' exists

    # When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'test.js'
    # And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    # Then I expect '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/test.js"]' appear 1 time on screen

    # #  Check file status
    # When I click on '[data-cy="git-current-branch-button"]'
    # And  I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    # Then I expect '[data-cy="git-status-dialog"]' exists
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="staged-item"]' appear 0 time on screen
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="modified-item"]' appear 0 time on screen
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="untracked-item"]' appear 1 time on screen

    # When I click on '[data-cy="close-dialog-button"]'

    # #  Add file
    # And  I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/test.js"]' to make it visible
    # And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/test.js"]'
    # And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'
    # And  I wait 2 seconds

    # #  Check file status
    # And  I click on '[data-cy="git-current-branch-button"]'
    # And  I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    # And  I wait 2 seconds
    # Then I expect '[data-cy="git-status-dialog"]' exists
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="staged-item"]' appear 1 time on screen
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="modified-item"]' appear 0 time on screen
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="untracked-item"]' appear 0 time on screen
    # When I click on '[data-cy="close-dialog-button"]'

    # #  Update file content
    # And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'test.js'
    # And  I set active file content to 'updated content'
    # And  I wait 2 seconds

    # #  Check file status
    # And  I click on '[data-cy="git-current-branch-button"]'
    # And  I click on '[data-cy="git-branch-menu"] [data-cy="git-status-item"]'
    # And  I wait 2 seconds
    # Then I expect '[data-cy="git-status-dialog"]' exists
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="staged-item"]' appear 1 time on screen
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="modified-item"]' appear 1 time on screen
    # And  I expect '[data-cy="git-status-dialog"] [data-cy="untracked-item"]' appear 0 time on screen

    # ### Setup for following tests
    # When I click on '[data-cy="close-dialog-button"]'

    ## 1101 An unmodified file should not have the 'add' action inside file explorer menu
    And  I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/README.md"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/README.md"]'
    Then I expect '[data-cy="file_{{ projectName }}/README.md"].file-status-unmodified' exists
    And  I expect '[data-cy="file-explorer-action-menu"]' exists
    But  I expect '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]' not exists

    ## 1102 Create a file inside the root folder and add it on git should change the file's status
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'createdFileOne.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '.file-status-untracked' appear 2 times on screen
    And  I expect '[data-cy="file_{{ projectName }}/createdFileOne.js"].file-status-untracked' exists

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/createdFileOne.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/createdFileOne.js"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'
    Then I expect 'positive' toast to appear with text 'File is added &#129395;!'
    And  I expect '[data-cy="file_{{ projectName }}/createdFileOne.js"].file-status-staged' exists

    ## 1103 Create a file inside sub-folder and add it on git should change the file's status
    When I hover '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ modelFolder }}"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="folder-button_{{ projectName }}/{{ modelFolder }}"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="create-file-action-item"]'
    Then I expect '[data-cy="create-file-dialog"]' exists

    When I set on '[data-cy="create-file-form"] [data-cy="name-input"]' text 'createdFileTwo.js'
    And  I click on '[data-cy="create-file-form"] [data-cy="submit-button"]'
    Then I expect 'positive' toast to appear with text 'File is created &#129395;!'
    And  I expect '[data-cy="create-file-form"]' is closed
    And  I expect '.file-status-untracked' appear 2 times on screen
    And  I expect '[data-cy="file_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"].file-status-untracked' exists

    When I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists

    When I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'
    Then I expect 'positive' toast to appear with text 'File is added &#129395;!'
    And  I expect '[data-cy="file_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"].file-status-staged' exists

    ## 1201 Open a file in root folder and update its content should change the file's class
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/createdFileOne.js"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file_{{ projectName }}/createdFileOne.js"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'createdFileOne.js'
    And  I expect '[data-cy="file_{{ projectName }}/createdFileOne.js"].file-status-staged' exists
    And  I expect active file content to contain ''

    When I set active file content to 'updated content'
    Then I expect active file content to contain 'updated.*content'
    And  I expect '[data-cy="file_{{ projectName }}/createdFileOne.js"].file-status-modified' exists

    ## 1202 Open a file in sub-folder and update its content should change the file's class
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'createdFileTwo.js'
    And  I expect '[data-cy="file_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"].file-status-staged' exists
    And  I expect active file content to contain ''

    When I set active file content to 'updated content'
    And  I wait 1 second
    Then I expect '[data-cy="file_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"].file-status-modified' exists
    And  I expect active file content to contain 'updated.*content'

    ## 1203 Update a file's content should make the 'add' action available inside file explorer menu
    When I hover '[data-cy="file-explorer"] [data-cy="file_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ projectName }}/{{ modelFolder }}/createdFileTwo.js"]'
    Then I expect '[data-cy="file-explorer-action-menu"]' exists
    And  I expect '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]' exists

    ### Setup for following tests
    And  I click on '[data-cy="home-page-link"]'
    And  I click on '[data-cy="project-card_{{ importedProjectName }}"]'
    And  I click on '[data-cy="diagram-path_terraform"]'
    And  I click on '[data-cy="navigation-bar"] [data-cy="modelizer-switch-button"] [aria-pressed="false"]'
    And  I wait 2 seconds

    ## 1301 Open a file and checkout branch, the file should reload if its panel has changed
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/branch.txt"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'

    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    And  I wait 5 seconds
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/branch.txt"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="git-current-branch-button"]' is 'test/remote'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'test/remote'

    ## 1302 Open two files, checkout branch and if an opened file no longer exists, its corresponding tab should be closed
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_main"]'
    And  I wait 5 seconds
    Then I expect '[data-cy="git-current-branch-button"]' is 'main'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'app.tf'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/README.md"]'
    And  I wait 2 seconds
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/branch.txt"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'

    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    And  I wait 5 seconds
    Then I expect '[data-cy="git-current-branch-button"]' is 'test/remote'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"] [data-cy="file_{{ importedProjectName }}/README.md"]' appear 0 time on screen
    And  I expect '[data-cy="file-tabs-container"] [role="tab"] [data-cy="file_{{ importedProjectName }}/branch.txt"]' appear 1 time on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'branch.txt'

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/branch.txt"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'test/remote'

    ## 1303 Open two files and checkout branch, then the active tab is closed, the other opened tab becomes the active tab
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_main"]'
    And  I wait 5 seconds
    Then I expect '[data-cy="git-current-branch-button"]' is 'main'
    And  I expect '[data-cy="file-tab-panel_app.tf"]' exists

    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/branch.txt"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tab-panel_branch.txt"]' is 'main'
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/README.md"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 3 times on screen
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'README.md'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="inactive-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_README.md"]' exists

    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_test/remote"]'
    And  I wait 5 seconds
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'app.tf'
    When I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/branch.txt"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="git-current-branch-button"]' is 'test/remote'
    And  I expect '[data-cy="file-tabs-container"] [role="tab"]' appear 2 times on screen
    And  I expect '[data-cy="file-tab-panel_README.md"]' not exists
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    And  I expect '[data-cy="file-tab-panel_branch.txt"]' is 'test/remote'

    ### Setup for following tests
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="checkout_main"]'
    And  I wait 5 seconds
    Then I expect '[data-cy="git-current-branch-button"]' is 'main'
    And  I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'app.tf'

    ## 1401 Update action should be available only for branch that are local and remote
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="update_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'

    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]'
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="update_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]'

    And  I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote1"]'
    Then I expect '[data-cy="git-branch-action-menu"] [data-cy="update_test/remote1"]' not exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="remote-branch_test/remote1"]'

    ## 1402 Execute update action with fast forward should be a success
    And  I click on '[data-cy="git-current-branch-button"]'
    And  I double click on '[data-cy="file-explorer"] [data-cy="file_{{ importedProjectName }}/branch.txt"]'
    And  I wait 2 seconds
    Then I expect '[data-cy="file-tabs-container"] [data-cy="active-tab"]' is 'branch.txt'
    When I set active file content to 'new updated content'
    And  I wait 1 second
    And  I hover '[data-cy="file-explorer"] [data-cy="file-button_{{ importedProjectName }}/branch.txt"]' to make it visible
    And  I click on '[data-cy="file-explorer"] [data-cy="file-button_{{ importedProjectName }}/branch.txt"]'
    And  I click on '[data-cy="file-explorer-action-menu"] [data-cy="git-add-file-action-item"]'
    And  I wait 2 seconds

    And  I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="update_main"]'
    Then I expect checkbox '[data-cy="git-update-form"] [data-cy="fast-forward-checkbox"]' is checked

    When I click on '[data-cy="git-update-form"] [data-cy="submit-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-update-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is updated 🥳!'

    ## 1403 Execute update action without fast forward should be a success
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    When I click on '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]'
    And  I click on '[data-cy="git-branch-action-menu"] [data-cy="update_main"]'
    And  I click on '[data-cy="git-update-form"] [data-cy="fast-forward-checkbox"]'
    Then I expect checkbox '[data-cy="git-update-form"] [data-cy="fast-forward-checkbox"]' is not checked

    When I click on '[data-cy="git-update-form"] [data-cy="submit-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-update-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is updated 🥳!'

    ## 1501 Expect to have no branch with 'no_main' filter
    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'not_main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' not exists

    ## 1502 Expect to have main branch with 'main' filter
    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    ## 1503 Create new branch then check if filter works
    When I click on '[data-cy="git-branch-menu"] [data-cy="git-new-branch-item"]'
    Then I expect checkbox '[data-cy="git-new-branch-form"] [data-cy="checkout-checkbox"]' is checked

    When I set on '[data-cy="git-new-branch-form"] [data-cy="branch-name-input"]' text 'testNewBranch'
    And  I click on '[data-cy="git-new-branch-form"] [data-cy="submit-button"]'
    Then I expect '[data-cy="git-new-branch-form"]' is closed
    And  I expect 'positive' toast to appear with text 'Branch is created 🥳!'

    When I click on '[data-cy="git-current-branch-button"]'
    And  I wait 3 seconds
    And  I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text ''
    And  I wait 3 seconds
    Then I expect '[data-cy="git-current-branch-button"]' is 'testNewBranch'
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_testNewBranch"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'not_main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_test-testNewBranch"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' not exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'no_main main'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_testNewBranch"]' not exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists

    When I set on '[data-cy="git-branch-menu"] [data-cy="search-branch-input"]' text 'no_main main testNewBranch'
    Then I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_main"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="local-branch_testNewBranch"]' exists
    And  I expect '[data-cy="git-branch-menu"] [data-cy="remote-branch_main"]' exists
