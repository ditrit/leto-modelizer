Feature: Test modelizer text view: common action of git branch menu

  Background:
    Given I clear cache
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    And I visit the "/#/modelizer/{{ projectName }}/text"

  Scenario: Should check the text of expand branches button
    When I click on "[data-cy=\"git-current-branch\"]"
    And I wait 2 seconds
    # Create new branch test 1
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    And I expect "[data-cy=\"git-newBranch-form\"]" exists
    And I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "test1"
    And I click on "[data-cy=\"git-checkout-checkbox\"]"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    And I expect "[data-cy=\"import-project-form\"]" is closed
    # Create new branch test 2
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    And I expect "[data-cy=\"git-newBranch-form\"]" exists
    And I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "test2"
    And I click on "[data-cy=\"git-checkout-checkbox\"]"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    # Create new branch test 3
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    And I expect "[data-cy=\"git-newBranch-form\"]" exists
    And I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "test3"
    And I click on "[data-cy=\"git-checkout-checkbox\"]"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    # Create new branch test 4
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    And I expect "[data-cy=\"git-newBranch-form\"]" exists
    And I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "test4"
    And I click on "[data-cy=\"git-checkout-checkbox\"]"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    # Create new branch test 5
    And I click on "[data-cy=\"git-menu-new-branch\"]"
    And I expect "[data-cy=\"git-newBranch-form\"]" exists
    And I set on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-branch-input\"]" text "test5"
    And I click on "[data-cy=\"git-checkout-checkbox\"]"
    And I click on "[data-cy=\"git-newBranch-form\"] [data-cy=\"git-form-submit\"]"
    And I expect "[data-cy=\"git-newBranch-form\"]" is closed

    When I click on "[data-cy=\"git-current-branch\"]"
    And I click on "[data-cy=\"git-current-branch\"]"
    And I wait 2 seconds
    And I scroll to "bottom" into "[data-cy=\"git-branch-menu\"]"
    Then I expect "[data-cy=\"git-branch-expand-menu-text\"]" is "Show 1 more..."

    When I click on "[data-cy=\"git-branch-expand-local-menu\"]"
    Then I expect "[data-cy=\"git-branch-expand-local-menu\"] [data-cy=\"git-branch-expand-menu-text\"]" is "Show less"

    When I click on "[data-cy=\"project-settings\"]"
    And I click on "[data-cy=\"git-current-branch\"]"
    Then I expect "[data-cy=\"git-branch-expand-local-menu\"] [data-cy=\"git-branch-expand-menu-text\"]" is "Show 1 more..."
