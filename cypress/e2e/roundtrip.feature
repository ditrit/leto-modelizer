Feature: Test roundtrip of the application

  @skip
  # TODO: update/fix test
  Scenario: Create project, switch and go back to homepage
    Given I clear cache
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/#/modelizer/project-[a-f0-9]{8}/model"
    And  I extract "project-[a-f0-9]{8}" from url in field "projectName" of context

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-explorer\"]" exists
    And  I expect "[data-cy=\"file-tabs\"]" exists
    And I expect current url is "/#/modelizer/{{ projectName }}/text"

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    And I expect current url is "/#/modelizer/{{ projectName }}/model"

    When I click on "[data-cy=\"app-logo-link\"]"
    Then I expect current url is "/"
    And I expect "[data-cy=\"project-card-{{ projectName }}\"]" exists
