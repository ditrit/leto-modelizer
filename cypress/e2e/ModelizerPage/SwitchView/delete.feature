Feature: Test switch model to text view: delete component/link

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

  @skip
    # TODO: Remove @skip tag when https://github.com/ditrit/leto-modelizer/issues/128 is done
  Scenario: Delete a component (Model view) should remove plugin file (Text view)
    When I click on "[data-cy=\"component-definition-image\"]"
    Then I expect "[id^=\"image_\"]" exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"
    And  I expect active file content to contain "\"type\":.*\"image\""

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists

    When I click on "[id^=\"image_\"]"
    And  I click on "[id=\"remove-component\"]"
    Then I expect "[id^=\"image_\"]" not exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    But  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" not exists

  Scenario: Delete one of two components (Model view) should remove corresponding object inside plugin file content (Text view)
    When I click on "[data-cy=\"component-definition-image\"]"
    And  I click on "[data-cy=\"component-definition-money\"]"
    Then I expect "[id^=\"image_\"]" exists
    And  I expect "[id^=\"money_\"]" exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-leto-modelizer.config.json\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "default.plugin-test.js"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    
    When I wait 1 second
    And  I click on "[data-cy=\"file-tabs-container\"] [data-cy=\"file-label-default.plugin-test.js\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"
    And  I expect active file content to contain "\"type\":.*\"image\""
    And  I expect active file content to contain "\"type\":.*\"money\""

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists

    When I click on "[id^=\"image_\"]"
    And  I click on "[id=\"remove-component\"]"
    Then I expect "[id^=\"money_\"]" exists
    And  I expect "[id^=\"image_\"]" not exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect active file content to contain "\"type\":.*\"money\""
    But  I expect active file content to not contain "\"type\":.*\"image\""

  Scenario: Remove object inside plugin file content (Text view) should remove related component (Model view)
    #  NOTE: NOT WORKING if plugin file content is empty (error console -> TypeError: JSON.parse(...) is null - plugin-test.js)
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

    When I set active file content to "[]"
    And  I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    But  I expect "[id^=\"truck_\"]" not exists

  Scenario: Remove one of the two objects inside plugin file content (Text view) should only display the remaining component
    When I click on "[data-cy=\"component-definition-truck\"]"
    And  I click on "[data-cy=\"component-definition-image\"]"
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

  Scenario: Delete plugin file (Text view) should remove related component (Model view)
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

    When I hover "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-default.plugin-test.js\"]" to make it visible
    And  I click on "[data-cy=\"file-explorer\"] [data-cy=\"file-explorer-buttons-default.plugin-test.js\"]"
    Then I expect "[data-cy=\"file-explorer-action-menu\"]" exists

    When I click on "[data-cy=\"file-explorer-menu-delete-file\"]"
    Then I expect "[data-cy=\"delete-file-dialog\"]" exists

    When I click on "[data-cy=\"delete-file-form\"] [data-cy=\"delete-file-submit\"]"
    Then I expect "positive" toast to appear with text "File is deleted."
    And  I expect "[data-cy=\"delete-file-form\"]" is closed
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" not exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    And  I expect "[id^=\"truck_\"]" not exists

  Scenario: Delete a link between two components (Model view) should remove corresponding attribute in object inside plugin file content (Text view)
    When I click on "[data-cy=\"component-definition-paper\"]"
    And  I click on "[data-cy=\"component-definition-image\"]"
    And  I click on "[id^=\"paper_\"]"
    And  I click on "[id=\"create-link\"]"
    And  I click on "[id^=\"image_\"]"
    Then I expect "[class=\"link\"]" exists
    
    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-leto-modelizer.config.json\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "default.plugin-test.js"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    
    When I wait 1 second
    And  I click on "[data-cy=\"file-tabs-container\"] [data-cy=\"file-label-default.plugin-test.js\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"
    And  I expect active file content to contain "\"type\":.*\"image\""
    And  I expect active file content to contain "\"type\":.*\"paper\""
    And  I expect active file content to contain "\"name\":.*\"image-attachments\""
    And  I expect active file content to contain "\"type\":.*\"Array\""

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    And  I expect "[class=\"link\"]" appear 1 time on screen

    #  NOTE: must force click because the following two elements are covered by an overflowing svg element
    When I force click on "[class=\"link\"]"
    And  I force click on "[id=\"remove-link\"]"
    Then I expect "[class=\"link\"]" not exists

    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect active file content to contain "\"type\":.*\"image\""
    And  I expect active file content to contain "\"type\":.*\"paper\""
    But  I expect active file content to not contain "\"name\":.*\"image-attachments\""
    And  I expect active file content to not contain "\"type\":.*\"Array\""

  Scenario: Remove link attribute inside plugin file content (Text view) should remove the link between the two components (Model view)
    When I click on "[data-cy=\"component-definition-paper\"]"
    And  I click on "[data-cy=\"component-definition-image\"]"
    And  I click on "[id^=\"paper_\"]"
    And  I click on "[id=\"create-link\"]"
    And  I click on "[id^=\"image_\"]"
    Then I expect "[class=\"link\"]" exists
    
    When I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Text"
    And  I expect "[data-cy=\"modelizer-text-view\"]" exists
    And  I expect "[data-cy=\"file-label-default.plugin-test.js\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-label-leto-modelizer.config.json\"]" appear 2 times on screen
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"inactive-tab\"]" is "default.plugin-test.js"
    And  I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "leto-modelizer.config.json"
    
    When I wait 1 second
    And  I click on "[data-cy=\"file-tabs-container\"] [data-cy=\"file-label-default.plugin-test.js\"]"
    Then I expect "[data-cy=\"file-tabs-container\"] [data-cy=\"active-tab\"]" is "default.plugin-test.js"
    And  I expect active file content to contain "\"type\":.*\"Array\""
    And  I expect active file content to contain "\"name\":.*\"image-attachments\""

    When I set active file content to "[{ \"path\": \"default.plugin-test.js\", \"__class\": \"Component\", \"id\": \"image_5f5d4a39\", \"name\": \"image_5f5d4a39\", \"attributes\": [], \"type\": \"image\" }, { \"path\": \"default.plugin-test.js\", \"__class\": \"Component\", \"id\": \"paper_4ba1f415\", \"name\": \"paper_4ba1f415\", \"attributes\": [], \"type\": \"paper\" }]"
    And  I click on "[data-cy=\"modelizer-switch\"] [aria-pressed=\"false\"]"
    Then I expect "[data-cy=\"modelizer-switch\"] [aria-pressed=\"true\"] [class=\"block\"]" is "Model"
    And  I expect "[data-cy=\"modelizer-model-view-draw-root\"]" exists
    And  I expect "[class=\"link\"]" not exists
    And  I expect "[id^=\"paper_\"]" exists
    And  I expect "[id^=\"image_\"]" exists
