import { randomHexString } from 'src/composables/Random';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import * as BrowserFS from 'browserfs';
import { FileInformation, FileInput } from 'leto-modelizer-plugin-core';
import GitEvent from 'src/composables/events/GitEvent';
import Branch from 'src/models/git/Branch';

const fs = BrowserFS.BFSRequire('fs');
const { Buffer } = BrowserFS.BFSRequire('buffer');

export const PROJECT_STORAGE_KEY = 'projects';

/**
 * Represent a project object.
 *
 * @typedef {Object} Project
 * @property {string} id project id
 */

/**
 * Create a project with generated id.
 *
 * @returns {Project} Project object with generated id.
 */
export function createProjectTemplate() {
  return { id: `project-${randomHexString(8)}` };
}

/**
 * Get a map of all projects.
 *
 * @return {Object} Object that contains all project id as key and associated project as value
 */
export function getProjects() {
  const lsProjects = localStorage.getItem(PROJECT_STORAGE_KEY);
  return JSON.parse(lsProjects || '{}');
}

/**
 * Get one project by its ID.
 *
 * @param {string} projectId
 * @returns {?Project}
 */
export function getProjectById(projectId) {
  const projects = getProjects();
  return projects[projectId];
}
/**
 * Save the project state.
 *
 * @param {Project} project - Project to save
 */
export function saveProject(project) {
  const projects = getProjects();
  projects[project.id] = project;
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Save project and initialize git in local storage.
 * @param {Project} project - Project to save
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export function initProject(project) {
  saveProject(project);
  return git.init({ fs, dir: `/${project.id}` });
}

/**
 * Clear one project by ID.
 *
 * @param {String} projectId - Id of project.
 */
export function deleteProjectById(projectId) {
  const projects = getProjects();
  if (projects[projectId]) {
    delete projects[projectId];
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }
}

/**
 * Fetch project on git. Emit a FetchEvent on success.
 * @param {String} projectId - Id of project.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function fetchGit(projectId) {
  const project = getProjectById(projectId);
  if (project.git && project.git.repository) {
    await git.fetch({
      fs,
      http,
      url: project.git.repository,
      dir: `/${projectId}`,
      onAuth: () => ({
        username: project.git.username,
        password: project.git.token,
      }),
      corsProxy: 'https://cors.isomorphic-git.org',
    });
  }
  return GitEvent.FetchEvent.next();
}

/**
 * Update remote origin, fetch and checkout the default branch.
 * @param {Project} project - Project to update.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function updateGitProject(project) {
  const dir = `/${project.id}`;

  await git.addRemote({
    fs,
    dir,
    url: project.git.repository,
    remote: 'origin',
    force: true,
  });

  await fetchGit(project.id);

  const branches = await git.listBranches({
    fs,
    dir,
    remote: 'origin',
  });

  const ref = branches.filter((branche) => branche !== 'HEAD')
    .find(() => true);

  return git.checkout({
    fs,
    dir,
    ref,
    force: true,
  });
}

/**
 * Retrieve list of project files name.
 * @param {String} projectId - Id of project.
 * @return {Promise<FileInformation[]>} Promise with file names array on success,
 * otherwise error.
 */
export async function getProjectFiles(projectId) {
  const project = getProjectById(projectId);
  const files = await git.listFiles({ fs, dir: `/${project.id}` });

  return files.map((file) => new FileInformation({ path: file }));
}

/**
 * Get file content.
 * @param {String} projectId - Id of project.
 * @param {FileInformation} fileInformation - Object that contain file path.
 * @return {Promise<FileInput>} Promise with file content on success otherwise error.
 */
export async function readProjectFile(projectId, fileInformation) {
  const project = getProjectById(projectId);
  const dir = `/${project.id}`;

  const commitOid = await git.resolveRef({ fs, dir });
  const { blob } = git.readBlob({
    fs,
    dir,
    oid: commitOid,
    filepath: fileInformation.path,
  });

  return new FileInput({
    path: fileInformation.path,
    content: Buffer.from(blob).toString('utf8'),
  });
}

/**
 * Get current branch of git project.
 * @param {String} projectId - Id of project.
 * @return {Promise<String>} Promise with current branch name on success otherwise error.
 */
export async function getCurrentBranch(projectId) {
  return git.currentBranch({
    fs,
    dir: `/${projectId}`,
    fullname: false,
  });
}

/**
 * Get all branches of project.
 * @param {String} projectId - Id of project.
 * @return {Promise<Branch[]>} Promise with array of branches on success otherwise error.
 */
export async function getBranches(projectId) {
  const dir = `/${projectId}`;

  const [local, remote] = await Promise.all([
    git.listBranches({
      fs,
      dir,
    }),
    git.listBranches({
      fs,
      dir,
      remote: 'origin',
    }),
  ]);

  const branches = local.map((localBranch) => (new Branch({
    name: localBranch,
    onLocal: true,
    onRemote: remote.includes(localBranch),
    remote: 'origin',
  })));

  // TODO: remove this when https://github.com/isomorphic-git/isomorphic-git/issues/1650 is resolve.
  if (branches.length === 0) {
    const currentBranch = await getCurrentBranch(projectId);
    branches.push(new Branch({
      name: currentBranch,
      onLocal: true,
      onRemote: false,
      remote: 'origin',
    }));
  }

  return branches.concat(
    remote
      .filter((remoteBranch) => !local.includes(remoteBranch))
      .map((remoteBranch) => (new Branch({
        name: remoteBranch,
        onLocal: false,
        onRemote: true,
        remote: 'origin',
      }))),
  ).filter(({ name }) => name !== 'HEAD');
}
