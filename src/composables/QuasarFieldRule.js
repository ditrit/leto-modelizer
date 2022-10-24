/**
 * Check if value is not empty.
 * @param {Function} t - I18n translate function.
 * @param {String} value - Value to check.
 * @return {boolean|String} Return true if the value is not empty otherwise the translated
 * error message.
 */
export function notEmpty(t, value) {
  return (value && value.length > 0) || t('errors.empty');
}

/**
 * Check if value is a valid git repository url.
 * @param {Function} t - I18n translate function.
 * @param {String} value - Value to check.
 * @return {boolean|String} Return true if the value is a valid git repository url otherwise
 * the translated error message.
 */
export function isGitRepositoryUrl(t, value) {
  return /^http(s)?:\/\/.+\/.*(?<!\.git)$/.test(value)
    || t('errors.invalid.gitProvider.repository');
}

/**
 * Check if the branch name does not already exist.
 * @param {Function} t - I18n translate function.
 * @param {Branch[]} branches - All branches of project.
 * @param {String} value - Value to check.
 * @return {boolean|String} Return true if the branch doesn't already exist otherwise the translated
 * error message.
 */
export function isUniqueBranchName(t, branches, value) {
  return branches.every((branch) => branch.name !== value)
    || t('errors.git.branch.duplicate');
}

/**
 * Check if value is a valid file label.
 * @param {Function} t - I18n translate function.
 * @param {String} value - Value to check.
 * @return {boolean|String} Return true if valid otherwise the translated error message.
 */
export function isValidFileLabel(t, value) {
  return !value.includes('/')
    || t('errors.invalid.fileExplorer.label');
}

/**
 * Check if a file's label does not already exist.
 * @param {Function} t - I18n translate function.
 * @param {Object[]} tree - Tree Object.
 * @param {String} tree.label - Label of a file.
 * @param {String} value - Value to check.
 * @return {boolean|String} Return true if the node label doesn't already exist,
 * otherwise the translated error message.
 */
export function isUniqueFileLabel(t, tree, value) {
  return tree.every(({ label }) => label !== value)
    || t('errors.fileExplorer.label.duplicate');
}
