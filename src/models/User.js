/**
 * User class.
 */
class User {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.firstname] - User firstname.
   * @param {string} [props.lastname] - User lastname.
   * @param {string} [props.email] - User email.
   * @param {string} [props.id] - User userId.
   */
  constructor(props = {
    firstname: null,
    lastname: null,
    email: null,
    id: null,
  }) {
    /**
     * User firstname.
     * @type {string}
     */
    this.firstname = props.firstname || null;
    /**
     * User lastname.
     * @type {string}
     */
    this.lastname = props.lastname || null;
    /**
     * User email.
     * @type {string}
     */
    this.email = props.email || null;
    /**
     * User userId.
     * @type {string}
     */
    this.id = props.id || null;
  }
}

export default User;
