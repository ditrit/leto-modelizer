/**
 * Represent a git branch.
 */
class Branch {
  /**
   * Default constructor.
   * @param {object} props - Constructor props.
   * @param {string} props.name - Branch name.
   * @param {boolean} [props.onLocal] - Indicate if branch is on local.
   * @param {boolean} [props.onRemote] - Indicate if branch is on remote.
   * @param {string} [props.remote] - Remote value.
   * @param {boolean} [props.isCurrentBranch] - Indicates if this branch is the current.
   */
  constructor(props = {
    name: null,
    onLocal: false,
    onRemote: false,
    remote: 'origin',
    isCurrentBranch: false,
  }) {
    /**
     * Branch name.
     * @type {string}
     */
    this.name = props.name || null;
    /**
     * Indicate if branch is on local.
     * @type {boolean}
     */
    this.onLocal = props.onLocal || false;
    /**
     * Indicate if branch is on remote.
     * @type {boolean}
     */
    this.onRemote = props.onRemote || false;
    /**
     * Remote value.
     * @type {string}
     */
    this.remote = props.remote || 'origin';
    /**
     * Indicate if this branch is the current.
     * @type {boolean}
     */
    this.isCurrentBranch = props.isCurrentBranch || false;
  }

  /**
   * Get full name of branch, concatenation of remote and name.
   * @returns {string} Concatenation of remote and branch names.
   */
  get fullName() {
    return this.onRemote ? `${this.remote}/${this.name}` : '';
  }

  /**
   * Compare this branch to the provided branch.
   * @param {Branch} branch - The branch to compare.
   * @returns {number} A negative number if this branch occurs before compared branch; positive if
   * this branch occurs after compared branch; 0 if they are equivalent.
   */
  compare(branch) {
    if (this.isCurrentBranch) {
      return -1;
    }
    if (branch.isCurrentBranch) {
      return 1;
    }
    return this.name.localeCompare(branch.name);
  }
}
export default Branch;
