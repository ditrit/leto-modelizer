/**
 * Representing a user project.
 */
class Project {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.id] - The id of this project.
   * @param {number} [props.creationDate] - The creation date of this project in timestamp.
   * @param {object} [props.git] - Git settings of this project.
   * @param {string} [props.git.token] - Access token of repository of this project.
   * @param {string} [props.git.repository] - Repository url of this project.
   * @param {string} [props.git.username] - Username for access of this repository.
   */
  constructor(props = {
    id: null,
    creationDate: null,
    git: {
      token: null,
      repository: null,
      username: null,
    },
    jenkins: {
      url: null,
      username: null,
      token: null,
    },
  }) {
    /**
     * The id of this project.
     * @type {string}
     */
    this.id = props.id || null;
    /**
     * The creation date of this project in timestamp.
     * @type {number}
     */
    this.creationDate = props.creationDate || null;
    /**
     * Git settings of this project.
     * @type {{token: string, repository: string, username: string}}
     */
    this.git = {
      token: null,
      repository: null,
      username: null,
      ...props.git,
    };
    /**
     * Jenkins settings of this project.
     * @type {{url: String, username: String, token: String}}
     */
    this.jenkins = {
      url: null,
      username: null,
      token: null,
      ...props.jenkins,
    };
  }

  /**
   * Is a local project.
   * A local project is a project that is not linked to a repository url.
   * @returns {boolean} Is local.
   */
  get isLocal() {
    return !this.git?.repository || this.git.repository.trim() === '';
  }

  /**
   * Is a remote project.
   * A remote project is a project that is linked to a repository url.
   * @returns {boolean} Is remote.
   */
  get isRemote() {
    return !this.isLocal;
  }
}

export default Project;
