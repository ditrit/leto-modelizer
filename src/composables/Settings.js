import UserSettings from 'src/models/UserSettings';

/**
 * Get user's setting by key.
 * @param {string} key - Setting key.
 * @returns {string|number|boolean} User's setting.
 */
export function getUserSetting(key) {
  return new UserSettings(JSON.parse(localStorage.getItem('user-settings')))[key];
}

/**
 * Set user's setting key with provided value.
 * @param {string} key - Setting key.
 * @param {string|number|boolean} value - User's setting value.
 */
export function setUserSetting(key, value) {
  const settings = new UserSettings(JSON.parse(localStorage.getItem('user-settings')));

  settings[key] = value;

  localStorage.setItem('user-settings', JSON.stringify(settings));
}
