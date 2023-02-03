Feature: Test switch model to text view: add component/link

  Background:
    Given I clear cache
    And I set viewport size to "1536" px for width and "960" px for height
    And I visit the "/"

    When I click on "[data-cy=\"new-project\"]"
    Then I expect current url is "/modelizer/project-[a-f0-9]{8}/model"
    And  I expect "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]" appear 1 time on screen
    And  I expect "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"] [data-cy=\"plugin-definitions-title\"]" is "leto-modelizer-plugin-test"

    Given I extract "project-[a-f0-9]{8}" from url in field "projectName" of context
    
    When I click on "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]"
    Then I expect "[class*=\"component-definition-card\"]" appear 7 times on screen

  Scenario: Plugin test installed in component definitions list (Model view) should create project configuration file (Text view)
    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" not exists
    And  I expect "[data-cy=\"file-label-leto-modelizer.config.json\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    And  I expect active file content to contain "{.*\"leto-modelizer-plugin-test\":.*{}}"

  Scenario: Add a component (Model view) should create project configuration file (Text view)
    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" not exists
    And  I expect "[data-cy=\"file-label-leto-modelizer.config.json\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    And  I expect active file content to contain "{.*\"leto-modelizer-plugin-test\":.*{}}"

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    
    When I wait 1 second
    And  I click on "[data-cy=\"plugin-definitions-leto-modelizer-plugin-test\"]"
    And  I wait 1 second
    And  I click on "[data-cy=\"component-definition-truck\"]"
    Then I expect "[id^=\"truck_\"]" exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-leto-modelizer.config.json\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "leto-modelizer.config.json"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"
    And  I expect active file content to contain "\"type\":.*\"truck\""

  Scenario: Update plugin file's content with a new object (Text view) should display the corresponding plugin component (Model view)
    When I click on "[data-cy=\"component-definition-truck\"]"
    And  I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-leto-modelizer.config.json\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "default.plugin-test.js"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    
    When I wait 1 second
    And  I click on "[data-cy=\"file-tabs-container\"] [data-cy=\"file-label-default.plugin-test.js\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"

    When I set active file content to "[{ \"path\": \"default.plugin-test.js\", \"__class\": \"Component\", \"id\": \"image_9d1e0838\", \"name\": \"image_9d1e0838\", \"attributes\": [], \"type\": \"image\" }]"
    And  I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    And  I expect "[id^=\"image_\"]" exists
    But  I expect "[id^=\"truck_\"]" not exists
  
  Scenario: Link two components (Model view) should update plugin file's content with new attributes properties (Text view)
    When I click on "[data-cy=\"component-definition-paper\"]"
    And  I click on "[data-cy=\"component-definition-image\"]"

    When I click on "[id^=\"paper_\"]"
    And  I click on "[id=\"create-link\"]"
    And  I click on "[id^=\"image_\"]"
    Then I expect "[class=\"link\"]" exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "default.plugin-test.js"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    
    When I wait 1 second
    And  I click on "[data-cy=\"file-tabs-container\"] [data-cy=\"file-label-default.plugin-test.js\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"
    And  I expect active file content to contain "\"name\":.*\"image-attachments\""
    And  I expect active file content to contain "\"type\":.*\"Array\""

  Scenario: Add link attributes inside plugin file's content (Text view) should display link between two components (Model view)
    When I click on "[data-cy=\"component-definition-paper\"]"
    And  I click on "[data-cy=\"component-definition-image\"]"

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "default.plugin-test.js"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    
    When I wait 1 second
    And  I click on "[data-cy=\"file-tabs-container\"] [data-cy=\"file-label-default.plugin-test.js\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"
    And  I expect active file content to contain "\"type\":.*\"image\""
    And  I expect active file content to contain "\"type\":.*\"paper\""
    And  I expect active file content to not contain "\"name\": \"image-attachments\""
    And  I expect active file content to not contain "\"type\": \"Array\""

    When I set active file content to "[{ \"path\": \"default.plugin-test.js\", \"__class\": \"Component\", \"id\": \"paper_688b416a\", \"name\": \"paper_688b416a\", \"attributes\": [{\"name\": \"image-attachments\", \"value\": [\"image_d1e5fffd\"], \"type\": \"Array\"}], \"type\": \"paper\" }, { \"path\": \"default.plugin-test.js\", \"__class\": \"Component\", \"id\": \"image_d1e5fffd\", \"name\": \"image_d1e5fffd\", \"attributes\": [], \"type\": \"image\" }]"
    And  I wait 2 seconds
    And  I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    And  I wait 1 second
    And  I expect "[id^=\"image_\"]" exists
    And  I expect "[id^=\"paper_\"]" exists
    And  I expect "[class=\"link\"]" exists
