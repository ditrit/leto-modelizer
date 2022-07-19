# Leto Modelizer (leto-modelizer)

Technical topology low-code editing tool.

## Install

```
npm install
```

## Default commands

Usage explanation of scripts in `package.json`.

### dev

Run the application in dev mode.

### build

Build the application in `dist` folder.

### docs

Generate documentation with esdoc.

### lint

Run eslint check on the project.

### lint:fix

Run eslint fix on the project.

### lint:report

Generate issues report with eslint for sonar.

### test

Run all the unit tests.

### test:coverage

Generate coverage report of the unit tests.

## Development

### Directory structure

This is the default directory structure we use for this project:

```
leto-module-client
├ dist                 ⇨ Contains generated applicationb by the build command
├ docs                 ⇨ Contains all files generate by esdoc
├ public               ⇨ Contains all public files, like favicon
├ reports              ⇨ Contains all the report files for sonar
├ src                  ⇨ Contains all files for the leto-modelizer application
│ ├ assets             ⇨ Contains all the assets
│ ├ boot               ⇨ Contains all boot configuration
│ ├ components         ⇨ Contains all vue component
│ ├ css                ⇨ Contains all style
│ ├ i18n               ⇨ Contains translation engine and translation files 
│ ├ layouts            ⇨ Contains all the page layouts
│ ├ pages              ⇨ Contains all the page
│ ├ router             ⇨ Contains the router engine and the route definitions 
│ └ stores             ⇨ Contains store engine and all storages definitions
└ tests                ⇨ Contains all files related to the tests
```

### How to release

We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as guideline for the version management.

Steps to release:
- Checkout a branch `release/vX.Y.Z` from the latest `main`.
- Improve your version number in `package.json`, `package-lock.json` and `changelog.md`.
- Verify the content of the `changelog.md`.
- Commit your modification with this commit's name `Release version X.Y.Z`.
- Create a pull request on github to this branch in `main`.
- After the previous PR is merged, tag the `main` branch with `vX.Y.Z`
- After the tag is push, make the release on the tag in GitHub

### Git: Default branches

The default branch is `main`, we can't commit on it and we can only make a pull request to add some code.

Release tag are only on the `main` branch.

### Git: Branch naming policy

There is the branch naming policy: `[BRANCH_TYPE]/[BRANCH_NAME]`

* `BRANCH_TYPE` is a prefix to describe the purpose of the branch, accepted prefix are:
    * `feature`, used for feature development
    * `bugfix`, used for bug fix
    * `improvement`, used for refacto
    * `library`, used for updating library
    * `prerelease`, used for preparing the branch for the release
    * `release`, used for releasing project
    * `hotfix`, used for applying a hotfix on main
* `BRANCH_NAME` is managed by this regex: `[a-z0-9._-]` (`_` is used as space character).
