# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added

* Hide component detail panel when deleting corresponding component.
* Autosave on component detail panel.
* Debounce of 1 second on file auto-save.
* Add 'Rename' action in FileExplorer file/folder menu.
* Add administration view button.
* Setup conditional features:
  * `CF_createDiagram`: allows or prevents user to create a diagram.
  * `CF_createDiagramFromTemplate`: allows or prevents user to create a diagram from a template.
  * `CF_createComponent`: allows or prevents user to create a component.
  * `CF_createProjectFromTemplate`: allows or prevents user to create a project from a template.
  * `CF_deleteDiagram`: allows or prevents user to delete a diagram.
  * `CF_createProject`: allows or prevents user to create a project.
* Add settings button/menu to homepage and update its content.
* Add route to clear token.
* Improve dockerfile with version of plugins as argument. 
* Export diagram as svg.

### Changed

* Improve file explorer tree updating when file contents are updated.
* Improve performance of the automatic functional tests.
* Improve unit tests coverage.
* Technical content:
  * Update import of vue components.
* Plugin management:
  * Work with [plugin-core](https://github.com/ditrit/leto-modelizer-plugin-core/tree/0.25.0) version 0.25.0.
  * Work with [terrator-plugin](https://github.com/ditrit/terrator-plugin/tree/0.10.0) version 0.10.0.
  * Work with [githubator-plugin](https://github.com/ditrit/githubator-plugin/tree/0.4.1) version 0.4.1.
  * Work with [kubernator-plugin](https://github.com/ditrit/kubernator-plugin/tree/0.2.0) version 0.2.0.
* Improve performance on git add.
* Replace OIDC authentication by Leto-Modelizer-Api, see [this issue](https://github.com/ditrit/leto-modelizer/issues/425).
* Separating git-related functions into a dedicated composable.
* Merge add/create diagram buttons into a drop-down button, see [this issue](https://github.com/ditrit/leto-modelizer/issues/471).
* Improve Authentication by re-doing login process if the token is expired, see [this issue](https://github.com/ditrit/leto-modelizer/issues/478).
* Handle external id.
* Replaced old authentication (Parse) by the new LetoModelizeApi (Java/Spring).

### Fixed

* Fix bug on click on component definition from plugins with single file diagrams, see [this issue](https://github.com/ditrit/leto-modelizer/issues/407).
* Fix bug about rewritten file on checkout, see [this issue](https://github.com/ditrit/leto-modelizer/issues/422).
* Fix bug about required management for RegExp rule, see [this issue](https://github.com/ditrit/leto-modelizer/issues/387).
* Fix bugs about component creation on a click or a drag&drop, see [this issue](https://github.com/ditrit/leto-modelizer/issues/401) and [this issue](https://github.com/ditrit/leto-modelizer/issues/415).
* Fix bug about (Link|Reference)Input options update, see [this issue](https://github.com/ditrit/leto-modelizer/issues/390).
* Fix bug about adding ellipsis on long file name in file explorer, see [this issue](https://github.com/ditrit/leto-modelizer/issues/383).
* Fix Dockerfile by adding git in order to install plugins.
* Fix bug on creating folder with same name as root folder, see [this issue](https://github.com/ditrit/leto-modelizer/issues/393).
* Fix bug on missing file name in config file when using githubator-plugin, see [this issue](https://github.com/ditrit/leto-modelizer/issues/465).
* Fix bug on deleting last component of model file, the file is deleted and model is no longer displayed in the list, see [this issue](https://github.com/ditrit/leto-modelizer/issues/474).

### Removed

* Default space character on file creation.

## [1.3.0] - 2023/09/12

### Added

* Multi diagrams page:
  * Focus movement on all diagrams.
  * Delete diagrams.
  * Diagram selection.
  * Create empty diagram button.
* Index page:
  * Add a search bar to filter diagrams.
  * Add drawer to create diagram from a template.
* Homepage:
  * Display a warning message when importing a previously imported project.
* Integrate new diagram management.
* Login page:
  * Display buttons for each OIDC provider and perform user authentication if the global configuration file is declared.
* Draw page:
  * Add variables panel in left drawer.
  * Rename component id.
* Text editor page:
  * Add panel to display all errors.
  * Add a button to rearrange all components automatically.
* Splash screen.

### Changed

* Homepage:
  * Remove "About" button.
* Index page:
  * Redesign diagram list.
  * Redesign global page.
  * Add buttons to change diagram display (table or grid).
* Rework and clean all layouts and pages.
* Have only one configuration file by project to save all diagrams positions.
* Save diagram template position.
* Rework on project documenation (replace esdoc by jsdoc).
* Models page:
  * Rework on tag display, use tag category for all diagrams in table.
  * Rework on tag display, use tag language for plugin selection on create diagram from template.
  * Update naviguation bar to display user info.
* Draw page:
  * Rework on left drawer.
  * Re-design attribute fields.
  * Re-design information icon on attribute fields.
* Plugin management:
  * Work with [terrator-plugin](https://github.com/ditrit/terrator-plugin/tree/0.7.0) version 0.7.0.
  * Work with [plugin-core](https://github.com/ditrit/leto-modelizer-plugin-core/tree/0.21.0) version 0.21.0.
  * Work with [githubator-plugin](https://github.com/ditrit/githubator-plugin/tree/0.2.5) version 0.2.5.
* Improve performance of the automatic functionnal tests.
* User settings:
  * Save records by page in ModelsPage.

### Fixed

* Fix bug on models default folder opening, see [this issue](https://github.com/ditrit/leto-modelizer/issues/303).
* Fix Sonar new bugs/code smell due to quality profil change, see [this issue](https://github.com/ditrit/leto-modelizer/issues/322).
* Fix bug on using default file name from plugin instead of the file name specified by the user, when adding a component after creating a diagram from scratch.
* Fix bug on deleted files while pushing a branch or using "upload to git" button, see [this issue](https://github.com/ditrit/leto-modelizer/issues/358).
* Fix bug on import repository with `.git` or `/` at the end, see [this issue](https://github.com/ditrit/leto-modelizer/issues/368).
* Fix bug on open files of two models with similar names, see [this issue](https://github.com/ditrit/leto-modelizer/issues/370).
* Fix bug on setting bad type on Link/Reference attribute, see [this issue](https://github.com/ditrit/leto-modelizer-plugin-core/issues/188).
* Fix bug on deleting diagram to only delete related parsable files, see [this issue](https://github.com/ditrit/leto-modelizer/issues/392).
* Fix bug on diagram management in root folder, see [this issue](https://github.com/ditrit/leto-modelizer/issues/393).
* Fix position when drag & dropping new component after moving the viewport, see [this issue](https://github.com/ditrit/leto-modelizer/issues/373).
* Fix bug while dropping component inside a container, see [this issue](https://github.com/ditrit/leto-modelizer-plugin-core/issues/213).

### Removed

* Index page:
  * Template grid.
* Configuration for default path for models.

## [1.2.0] - 2023/06/07

### Added

* Homepage:
  * Add a left drawer that contains:
    * A button to display recent projects.
    * A short projects list access.
  * Sort projects by creating date from newest to oldest.
  * Add tags list to filter project.
  * Add search bar for projects.
  * Add search bar for templates.
* Multi diagrams page:
  * Display all diagrams of a project.
  * Zoom centered on all diagrams.

### Changed

* Homepage:
  * Redesign header.
  * Redesign create project from template popup.
  * Redesign project grid.
  * Redesign template grid.
  * Redesign template card.
* Plugin management:
  * Work with [terrator-plugin](https://github.com/ditrit/terrator-plugin/tree/0.3.0) version 0.3.0.
  * Work with [plugin-core](https://github.com/ditrit/leto-modelizer-plugin-core/tree/0.16.0) version 0.16.0.
  * Work with [githubator-plugin](https://github.com/ditrit/githubator-plugin/tree/0.2.0) version 0.2.0.

## [1.1.0] - 2023/05/04

### Added

* Create About page and footer.
* Project management:
  * Delete project.
  * Rename project.
  * Create blank project with custom name.
  * Create project from template with custom name.
* Component edition:
  * Allowed to have a predefined list of values for Array attribute.
* Text editor feature:
  * Integrate syntax colorization.
  * On open text editor, open all related files of the current model.
* Modelization feature:
  * Allow to use the mouse coordinates when placing new component on drag and drop feature.
  * Add button to redirect to the project page.
* Add new environment variable `KEEP_CYPRESS_ATTRIBUTE` to keep all cypress attribute in html.

### Changed

* Update e2e test plugin to terrator-plugin.
* Internal optimization of plugin usage.
* New display for library list & component grid.
* Plugin management:
  * Work with [terrator-plugin](https://github.com/ditrit/terrator-plugin/tree/0.2.0) version 0.2.0.
  * Work with [plugin-core](https://github.com/ditrit/leto-modelizer-plugin-core/tree/0.15.2) version 0.15.2.
  * Work with [githubator-plugin](https://github.com/ditrit/githubator-plugin/tree/0.1.1) version 0.1.1.
* Update [plugin-cli](https://github.com/ditrit/leto-modelizer-plugin-cli/tree/1.0.0) version 1.0.0.

### Fixed

* The file is now deleted when the last component of this file is deleted.
* Fix console error on reloading Model view page.
* Fix attribute focus.
* Fix duplication attribute on creation.
* Fix attribute error management.
* Fix bug on nested object in attribute edition, see [this issue](https://github.com/ditrit/leto-modelizer/issues/203).
* Fix bug on model files opening when switching on TextView, see [this issue](https://github.com/ditrit/leto-modelizer/issues/202).
* Fix bug on loosing boolean attributes defined to `false`, see [this issue](https://github.com/ditrit/leto-modelizer/issues/261).

## [1.0.0] - 2023/02/16

### Added

* Project management:
  * Create blank project.
  * Create project from template, with a preview of models.
  * Import project from git.
  * Import project from git and add model templates in it.
  * Git authentication settings.
* Model management:
  * Display all models of the project.
  * Create blank model.
  * Create model from template, with a preview of template.
  * Rename model.
  * Delete model.
* Modelization feature:
  * Display graph of a model.
  * Add component.
  * Add component from a template.
  * Edit component attributes.
  * Add new component attribute.
  * Display documentation about components and attributes.
* Text editor feature:
  * Create file and folder.
  * Delete file and folder.
  * Display and edit file content.
  * Filter only parsable file(s) for a plugin.
* Git management:
  * Display current branch of project.
  * Display local and remote branches.
  * Filter branches.
  * Change current branch.
  * Fetch update for current branch.
  * Create local branch.
  * Commit modification.
  * Push local branch.
  * Display git status of project.
  * Display git log of project.
  * Change/add remote of project.
  * `Update to git`, quick button to :
    * Create branch.
    * Commit work.
    * Push branch to git provider.
* Plugin management:
  * Work with multi-plugin.
  * Work with [terrator-plugin](https://github.com/ditrit/terrator-plugin/tree/0.1.12) version 0.1.12.
  * Work with [plugin-core](https://github.com/ditrit/leto-modelizer-plugin-core/tree/0.13.0) version 0.13.0.

[1.3.0]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#1.3.0
[1.2.0]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#1.2.0
[1.1.0]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#1.1.0
[1.0.0]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#1.0.0
