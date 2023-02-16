# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added

- Setup project (eslint, esdoc, unit test, i18n, quasar).
- Setup e2e test solution (cypress, cucumber, Gherkin Syntax).
- Add homepage
- Add the project list on the homepage
- Add Modelizer page
- Add the component definitions panel on the modelizer page
- Add monaco editor to modelizer text view
- Update git configuration for a project
- Update layout structure in ModelizerPage and ModelizerModelView
- Install CLI from leto-modelizer-plugin-cli
- Refacto ComponentDefinitionsPanel to ComponentDefinitionsDrawer
- Initialize git on project creation
- Update git remote on update git configuration
- Add file explorer on text view
- Add plugin manager
- Display current git branch of project in text view
- Add menu to list git repository branches
- Add search field for git branches menu
- Add checkout action on branch menu
- Add create new branch action on branch menu
- Add update action on branch menu
- Add status action on branch menu
- Add push action on branch menu
- Add commit action on branch menu
- Add log action on branch menu
- Draw component on definition click
- Add file tabs to wrap monaco editor on text view
- Add root folder in file explorer with project name as label
- Update PluginEvent for action menu
- Add fs writeProjectFile & createProjectFolder in Project composable
- Add create and delete file or folder action
- Add ParseEvent & RenderEvent management
- Add ComponentDetailPanel
- Add files status and color file's label regarding its status
- Add git add action
- Update dependencies
- Add Save button in ModelizerNavigationBar
- Add onUpdateFile function in ModelizerTextView and create FileTabHeader component
- Add Reference type attributes management in ComponentDetailPanel
- Add Unreferenced attributes management in ComponentDetailPanel
- Add object attributes management in ComponentDetailPanel
- Add an input in InputWrapper to allow updating the key (name) of the unreferenced attribute
- Add create and delete action for unreferenced attribute
- Add process.env variable for isomorphic-git cors proxy url
- Add required and rules management
- Create LinkInput
- Save and retrieve position of components in configuration file
- Import project on homepage
- Add component definition filter in definitions drawer
- Add checkbox to filter tree and display only parsable files in ModelizerTextView
- Display component definitions as a grid
- Factorize the opening of git dialogs inside GitBranchMenu
- Rename GitForm and GitConfigurationDialog to GitSettingsForm and GitSettingsDialog respectively
- Split git setting dialog in two different dialogs : GitAuthenticationDialog & GitAddRemoteDialog
- Create a component from a template
- Create ArrayInput
- Add menu to see definition of component or attribute
- Add support for component creation via drag and drop
- Add model selection page + draw only one model in modelization page
- Add carousel in NewProjectTemplateDialog and image in ImportModelTemplateDialog
- Add checkbox to force save attribute field(s) in error

[unreleased]: https://github.com/ditrit/leto-modelizer/blob/main/changelog.md#unreleased
