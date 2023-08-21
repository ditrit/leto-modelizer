import { getPluginByName } from 'src/composables/PluginManager';
import { FileInformation } from 'leto-modelizer-plugin-core';

/**
 * Check if value is not empty.
 * @param {Function} t - I18n translate function.
 * @param {string} value - Value to check.
 * @returns {boolean | string} Return true if the value is not empty otherwise the translated
 * error message.
 */
export function notEmpty(t, value) {
  return (value && value.length > 0) || t('errors.empty');
}

/**
 * Check if value is a valid url.
 * @param {Function} t - I18n translate function.
 * @param {string} value - Value to check.
 * @returns {boolean | string} Return true if the value is a valid url otherwise
 * the translated error message.
 */
export function isUrl(t, value) {
  return /^http(s)?:\/\/.+\/.*$/.test(value)
    || t('errors.invalid.gitAddRemote.repository');
}

/**
 * Check if value is a valid file label.
 * @param {Function} t - I18n translate function.
 * @param {string} value - Value to check.
 * @returns {boolean | string} Return true if valid otherwise the translated error message.
 */
export function isValidFileLabel(t, value) {
  return !value.includes('/')
    || t('errors.invalid.fileExplorer.label');
}

/**
 * Check if the value is required.
 * @param {Function} t - I18n translate function.
 * @param {string | number | boolean} value - Value to check.
 * @param {boolean} required - Rules value.
 * @returns {boolean | string} Return true if value is required and exist,
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
 * @param {string} value - Value to check.
 * @param {boolean} min - Rules value.
 * @returns {boolean | string} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isStringTooShort(t, value, min) {
  return !min || value?.length >= min || t('errors.rules.string.min', { min });
}

/**
 * Check if the value length is less than or equal to max.
 * @param {Function} t - I18n translate function.
 * @param {string} value - Value to check.
 * @param {boolean} max - Rules value.
 * @returns {boolean | string} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isStringTooLong(t, value, max) {
  return !max || value.length <= max || t('errors.rules.string.max', { max });
}

/**
 * Check if the value matches the RegExp.
 * @param {Function} t - I18n translate function.
 * @param {string} value - Value to check.
 * @param {boolean} regexp - Rules value.
 * @returns {boolean | string} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isStringMatchingRegExp(t, value, regexp) {
  return !regexp || (new RegExp(regexp)).test(value) || t('errors.rules.string.regexp', { regexp });
}

/**
 * Check if the value contains only number.
 * @param {Function} t - I18n translate function.
 * @param {string} value - Value to check.
 * @returns {boolean | string} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isNumber(t, value) {
  return !Number.isNaN(Number(value)) || t('errors.rules.number.nan');
}

/**
 * Check if the value is greater than or equal to min.
 * @param {Function} t - I18n translate function.
 * @param {number} value - Value to check.
 * @param {boolean} min - Rules value.
 * @returns {boolean | string} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isNumberTooSmall(t, value, min) {
  return !min || value >= min || t('errors.rules.number.min', { min });
}

/**
 * Check if the value is less than or equal to max.
 * @param {Function} t - I18n translate function.
 * @param {number} value - Value to check.
 * @param {boolean} max - Rules value.
 * @returns {boolean | string} Return true if value is valid,
 * otherwise the translated error message.
 */
export function isNumberTooBig(t, value, max) {
  return !max || value <= max || t('errors.rules.number.max', { max });
}

/**
 * Check if a value is unique in array.
 * @param {Function} t - I18n translate function.
 * @param {string[]} texts - List of texts.
 * @param {string} value - Value to check.
 * @param {string} message - Error message.
 * @returns {boolean | string} Return true if the value is unique in the list,
 * otherwise the translated error message.
 */
export function isUnique(t, texts, value, message) {
  return texts.every((text) => text !== value)
    || t(message);
}

/**
 * Check if model is unique.
 * @param {Function} t - I18n translate function.
 * @param {string} pluginName - Name of plugin.
 * @param {string[]} models - All project models.
 * @param {string} path - Model path to check.
 * @param {string} message - Error message.
 * @returns {boolean | string} Return true if the model is unique, otherwise the translated
 * error message.
 */
export function isUniqueModel(t, pluginName, models, path, message) {
  const plugin = getPluginByName(pluginName);
  const model = plugin.getModels([
    new FileInformation({ path }),
  ])[0];

  return isUnique(t, models, model, message);
}
