/**
 * Representing a user project.
 */
class Project {
  /**
   * Default constructor.
   * @param {Object} [props={}] - Object that contains all properties to set.
   * @param {String} [props.id=null] - The id of this project.
   * @param {Number} [props.creationDate=null] - The creation date of this project in timestamp.
   * @param {Object} [props.git={}] - Git settings of this project.
   * @param {String} [props.git.token=null] - Access token of repository of this project.
   * @param {String} [props.git.repository=null] - Repository url of this project.
   * @param {String} [props.git.username=null] - Username for access of this repository.
   */
  constructor(props = {
    id: null,
    creationDate: null,
    git: {
      token: null,
      repository: null,
      username: null,
    },
  }) {
    /**
     * The id of this project.
     * @type {String}
     */
    this.id = props.id || null;
    /**
     * The creation date of this project in timestamp.
     * @type {Number}
     */
    this.creationDate = props.creationDate || null;
    /**
     * Git settings of this project.
     * @type {{token: String, repository: String, username: String}}
     */
    this.git = {
      token: null,
      repository: null,
      username: null,
      ...props.git,
    };
  }

  /**
   * Is a local project.
   * A local project is a project that is not linked to a repository url.
   * @return {Boolean} Is local.
   */
  get isLocal() {
    return !this.git?.repository || this.git.repository.trim() === '';
  }

  /**
   * Is a remote project.
   * A remote project is a project that is linked to a repository url.
   * @return {Boolean} Is remote.
   */
  get isRemote() {
    return !this.isLocal;
  }
}

export default Project;
