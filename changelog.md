# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

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
* Splash screen.
* quasar/app-vite plugin to use vite instead of webpack.

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
* Draw page:
  * Rework on left drawer.
* Plugin management:
  * Work with [terrator-plugin](https://github.com/ditrit/terrator-plugin/tree/0.5.0) version 0.5.0.
  * Work with [plugin-core](https://github.com/ditrit/leto-modelizer-plugin-core/tree/0.19.0) version 0.19.0.
  * Work with [githubator-plugin](https://github.com/ditrit/githubator-plugin/tree/0.2.3) version 0.2.3.
* Improve performance of the automatic functionnal tests.
* User settings:
  * Save records by page in ModelsPage.

### Fixed

* Fix bug on models default folder opening, see [this issue](https://github.com/ditrit/leto-modelizer/issues/303).
* Fix Sonar new bugs/code smell due to quality profil change, see [this issue](https://github.com/ditrit/leto-modelizer/issues/322).
* Fix bug on using default file name from plugin instead of the file name specified by the user, when adding a component after creating a diagram from scratch.
* Fix bug on deleted files while pushing a branch or using "upload to git" button, see [this issue](https://github.com/ditrit/leto-modelizer/issues/358).
* Fix bug on import repository with `.git` or `/` at the end, see [this issue](https://github.com/ditrit/leto-modelizer/issues/368).

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

[1.1.0]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#1.1.0
[1.0.0]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#1.0.0
