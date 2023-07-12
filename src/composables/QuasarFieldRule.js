import { getPluginByName } from 'src/composables/PluginManager';
import { FileInformation } from 'leto-modelizer-plugin-core';

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
 * Check if the value is required.
 * @param {Function} t - I18n translate function.
 * @param {String|Number|Boolean} value - Value to check.
 * @param {Boolean} required - Rules value.
 * @return {Boolean|String} Return true if value is required and exist,
 * otherwise the translated error message.
 */
export function isRequired(t, value, required) {
  return !required
    || !(value === null || value === undefined || value.length === 0)
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
 * Check if the value contains only number.
 * @param {Function} t - I18n translate function.
 * @param {String} value - Value to check.
 * @return {Boolean|String} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isNumber(t, value) {
  return !Number.isNaN(Number(value)) || t('errors.rules.number.nan');
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

/**
 * Check if a value is unique in array.
 * @param {Function} t - I18n translate function.
 * @param {String[]} texts - List of texts.
 * @param {String} value - Value to check.
 * @param {String} message - Error message.
 * @returns {boolean|String} Return true if the value is unique in the list,
 * otherwise the translated error message.
 */
export function isUnique(t, texts, value, message) {
  return texts.every((text) => text !== value)
    || t(message);
}

/**
 * Check if model is unique.
 * @param {Function} t - I18n translate function.
 * @param {String} pluginName - Name of plugin.
 * @param {String[]} models - All project models.
 * @param {String} path - Model path to check.
 * @param {String} message - Error message.
 * @returns {boolean|String} Return true if the model is unique, otherwise the translated
 * error message.
 */
export function isUniqueModel(t, pluginName, models, path, message) {
  const plugin = getPluginByName(pluginName);
  const model = plugin.getModels([
    new FileInformation({ path }),
  ])[0];

  return isUnique(t, models, model, message);
}
