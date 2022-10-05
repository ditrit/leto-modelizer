/**
 * Represent a git branch.
 */
class Branch {
  /**
   * Default constructor.
   * @param {String} props.name - Branch name.
   * @param {Boolean} [props.onLocal=false] - Indicate if branch is on local.
   * @param {Boolean} [props.onRemote=false] - Indicate if branch is on remote.
   * @param {String} [props.remote='origin'] - Remote value.
   */
  constructor(props = {
    name: null,
    onLocal: false,
    onRemote: false,
    remote: 'origin',
  }) {
    /**
     * Branch name.
     * @type {String}
     */
    this.name = props.name || null;
    /**
     * Indicate if branch is on local.
     * @type {Boolean}
     */
    this.onLocal = props.onLocal || false;
    /**
     * Indicate if branch is on remote.
     * @type {Boolean}
     */
    this.onRemote = props.onRemote || false;
    /**
     * Remote value.
     * @type {String}
     */
    this.remote = props.remote || 'origin';
  }

  /**
   * Get full name of branch, concatenation of remote and name.
   * @return {String} Concatenation of remote and branch names.
   */
  get fullName() {
    return this.onRemote ? `${this.remote}/${this.name}` : '';
  }
}
export default Branch;
