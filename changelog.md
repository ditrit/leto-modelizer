# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added

* Create About page and footer.
* Project management:
  * Delete project.
  * Rename project.
  * Create blank project with custom name.
  * Create project from template with custom name.
* Component edition:
  * Allowed to have a predefined list of values for Array attribute.
* Add new environment variable `KEEP_CYPRESS_ATTRIBUTE` to keep all cypress attribute in html.

### Changed

* Update e2e test plugin to terrator-plugin.
* Internal optimization of plugin usage.
* New display for library list & component grid.
* Plugin management:
  * Work with [terrator-plugin](https://github.com/ditrit/terrator-plugin/tree/0.2.0) version 0.2.0.
  * Work with [plugin-core](https://github.com/ditrit/leto-modelizer-plugin-core/tree/0.15.2) version 0.15.2.

### Fixed

* The file is now deleted when the last component of this file is deleted.
* Fix console error on reloading Model view page.
* Fix attribute focus.
* Fix duplication attribute on creation.
* Fix attribute error management.

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

[1.0.0]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#1.0.0
