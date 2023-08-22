/**
 * Class to store all user's settings.
 */
class UserSettings {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.displayType] - Display type for diagrams, only 'grid' or 'table' are
   * accepted.
   * @param {number} [props.recordsByPage] - Number of records by page for diagrams table.
   */
  constructor(props = {
    displayType: 'table',
    recordsByPage: 5,
  }) {
    /**
     * Display type for diagrams, only 'grid' or 'table' are accepted.
     * @type {string}
     */
    this.displayType = props?.displayType || 'table';
    /**
     * Records by page for diagrams table.
     * @type {number}
     */
    this.recordsByPage = props?.recordsByPage || 5;
  }
}

export default UserSettings;
