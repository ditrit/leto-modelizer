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
   * @param {Boolean} [props.current=false] - Indicates if this branch is the current.
   */
  constructor(props = {
    name: null,
    onLocal: false,
    onRemote: false,
    remote: 'origin',
    current: false,
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
    /**
     * Indicate if this branch is the current.
     * @type {Boolean}
     */
    this.current = props.current || false;
  }

  /**
   * Get full name of branch, concatenation of remote and name.
   * @return {String} Concatenation of remote and branch names.
   */
  get fullName() {
    return this.onRemote ? `${this.remote}/${this.name}` : '';
  }

  /**
   * Compare this branch to the provided branch.
   * @param {Branch} branch - The branch to compare.
   * @return {Number} A negative number if this branch occurs before compared branch; positive if
   * this branch occurs after compared branch; 0 if they are equivalent.
   */
  compare(branch) {
    if (this.current) {
      return -1;
    }
    if (branch.current) {
      return 1;
    }
    return this.name.localeCompare(branch.name);
  }
}
export default Branch;
