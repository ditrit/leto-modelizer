Feature: Test modelizer draw view: plugin filter

  Background:
    Given I clear cache
    And   I set viewport size to '1536' px for width and '960' px for height
    And   I visit the '/'

    When I click on '[data-cy="create-project-button"]'
    And  I set on '[data-cy="create-project-form"] [data-cy="name-input"]' text 'projectName'
    And  I click on '[data-cy="create-project-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/models'

    # Model creation
    When I click on '[data-cy="create-model-button"]'
    Then I expect '[data-cy="create-model-form"] [data-cy="plugin-select"]' is 'terrator-plugin'

    When I set on '[data-cy="create-model-form"] [data-cy="name-input"]' text 'modelName'
    And  I click on '[data-cy="create-model-form"] [data-cy="submit-button"]'
    Then I expect current url is 'projectName/modelizer/draw\?path=terrator-plugin/modelName'
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"]' exists

  Scenario Outline: Set text as '<filter>' should display only one element inside plugin title
    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin (1)'

    Examples:
      | filter                |
      | aws_ami               |
      | server                |
      | aws_security_group    |
      | aws_instance          |
      | aws_volume_attachment |
      | aws_ebs_volume        |
      | aws_elb               |
      | aws_vpc               |
      | aws_internet_gateway  |
      | aws_subnet            |
      | aws_db_subnet_group   |
      | aws_route53_zone      |
      | aws_route53_record    |
      | aws_db_instance       |
      | aws_key_pair          |

  Scenario Outline: Set text as '<filter>' should display two elements inside plugin title
    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin (2)'

    Examples:
      | filter       |
      | ami server   |
      | security elb |
      | vpc internet |
      | instance     |
      | volume       |
      | subnet       |
      | route53      |

  Scenario Outline: Set text as '<filter>' should not display plugin.
    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 0 time on screen
    But  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    Examples:
      | filter    |
      | bad       |
      | amiserver |

  Scenario Outline: Select plugin and set text as '<filter>' should display only one element
    # Select 'terrator-plugin' library
    When I wait 1 second
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 18 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"].selected [data-cy="title"]' is 'terrator-plugin (1)'
    And  I expect '[data-cy="component-definition_<filter>"]' exists

    Examples:
      | filter                |
      | aws_ami               |
      | server                |
      | aws_security_group    |
      | aws_instance          |
      | aws_volume_attachment |
      | aws_ebs_volume        |
      | aws_elb               |
      | aws_vpc               |
      | aws_internet_gateway  |
      | aws_subnet            |
      | aws_db_subnet_group   |
      | aws_route53_zone      |
      | aws_route53_record    |
      | aws_db_instance       |
      | aws_key_pair          |

  Scenario Outline: Select plugin and set text as '<filter>' should display only two elements
    # Select 'terrator-plugin' library
    When I wait 1 second
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 18 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 2 times on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"].selected [data-cy="title"]' is 'terrator-plugin (2)'
    And  I expect '[data-cy="component-definition_<element1>"]' exists
    And  I expect '[data-cy="component-definition_<element2>"]' exists

    Examples:
      | filter       | element1              | element2             |
      | ami server   | aws_ami               | server               |
      | security elb | aws_security_group    | aws_elb              |
      | vpc internet | aws_vpc               | aws_internet_gateway |
      | instance     | aws_instance          | aws_db_instance      |
      | volume       | aws_volume_attachment | aws_ebs_volume       |
      | subnet       | aws_subnet            | aws_db_subnet_group  |
      | route53      | aws_route53_zone      | aws_route53_record   |

  Scenario Outline: Select plugin and set text as '<filter>' should not display any elements.
    # Select 'terrator-plugin' library
    When I wait 1 second
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 18 times on screen

    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 0 time on screen
    And  I expect '[data-cy="library-empty-message"]' exists
    And  I expect '[data-cy="library-empty-message"]' is 'Nothing to display'

    Examples:
      | filter    |
      | bad       |
      | amiserver |

  Scenario Outline: Set text as '<filter>' then select plugin should display only one element
    When I set on '[data-cy="definitions-filter-input"]' text '<filter>'
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"]' appear 1 time on screen
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"] [data-cy="title"]' is 'terrator-plugin (1)'

    # Select 'terrator-plugin' library
    When I wait 1 second
    Then I expect '[data-cy="component-definitions-item_terrator-plugin"].selected' exists
    And  I expect '[data-cy="component-definitions-item_terrator-plugin"].selected [data-cy="title"]' is 'terrator-plugin (1)'
    And  I expect '[data-cy="component-definition-grid"]' exists
    And  I expect '[data-cy="component-definition-grid"] [class*="component-definition-card"]' appear 1 time on screen
    And  I expect '[data-cy="component-definition_<filter>"]' exists

    Examples:
      | filter                |
      | aws_ami               |
      | server                |
      | aws_security_group    |
      | aws_instance          |
      | aws_volume_attachment |
      | aws_ebs_volume        |
      | aws_elb               |
      | aws_vpc               |
      | aws_internet_gateway  |
      | aws_subnet            |
      | aws_db_subnet_group   |
      | aws_route53_zone      |
      | aws_route53_record    |
      | aws_db_instance       |
      | aws_key_pair          |
