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
    || t('errors.invalid.gitAddRemote.repository');
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

/**
 * Check if the value is required.
 * @param {Function} t - I18n translate function.
 * @param {String|Number|Boolean} value - Value to check.
 * @param {Boolean} required - Rules value.
 * @return {Boolean|String} Return true if value is required and exist,
 * otherwise the translated error message.
 */
export function isRequired(t, value, required) {
  return !required
    || !(value === null || value === undefined || value === '')
    || t('errors.rules.required');
}

/**
 * Check if the value length is greater than or equal to min.
 * @param {Function} t - I18n translate function.
 * @param {String} value - Value to check.
 * @param {Boolean} min - Rules value.
 * @return {Boolean|String} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isStringTooShort(t, value, min) {
  return !min || value.length >= min || t('errors.rules.string.min', { min });
}

/**
 * Check if the value length is less than or equal to max.
 * @param {Function} t - I18n translate function.
 * @param {String} value - Value to check.
 * @param {Boolean} max - Rules value.
 * @return {Boolean|String} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isStringTooLong(t, value, max) {
  return !max || value.length <= max || t('errors.rules.string.max', { max });
}

/**
 * Check if the value matches the RegExp.
 * @param {Function} t - I18n translate function.
 * @param {String} value - Value to check.
 * @param {Boolean} regexp - Rules value.
 * @return {Boolean|String} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isStringMatchingRegExp(t, value, regexp) {
  return !regexp || (new RegExp(regexp)).test(value) || t('errors.rules.string.regexp', { regexp });
}

/**
 * Check if the value is greater than or equal to min.
 * @param {Function} t - I18n translate function.
 * @param {Number} value - Value to check.
 * @param {Boolean} min - Rules value.
 * @return {Boolean|String} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isNumberTooSmall(t, value, min) {
  return !min || value >= min || t('errors.rules.number.min', { min });
}

/**
 * Check if the value is less than or equal to max.
 * @param {Function} t - I18n translate function.
 * @param {Number} value - Value to check.
 * @param {Boolean} max - Rules value.
 * @return {Boolean|String} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isNumberTooBig(t, value, max) {
  return !max || value <= max || t('errors.rules.number.max', { max });
}
