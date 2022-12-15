import { randomHexString } from 'src/composables/Random';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import * as BrowserFS from 'browserfs';
import {
  FileInformation,
  FileInput,
} from 'leto-modelizer-plugin-core';
import Branch from 'src/models/git/Branch';
import FileEvent from 'src/composables/events/FileEvent';
import FileStatus from 'src/models/git/FileStatus';

const fs = BrowserFS.BFSRequire('fs');

export const PROJECT_STORAGE_KEY = 'projects';

/**
 * Represent a project object.
 * @typedef {Object} Project
 * @property {String} id - project id.
 */

/**
 * Create a project with generated id.
 * @return {Project} Project object with generated id.
 */
export function createProjectTemplate() {
  return { id: `project-${randomHexString(8)}` };
}

/**
 * Get a map of all projects.
 * @return {Object} Object that contains all project ids as keys and associated projects as values.
 */
export function getProjects() {
  const lsProjects = localStorage.getItem(PROJECT_STORAGE_KEY);
  return JSON.parse(lsProjects || '{}');
}

/**
 * Get one project by its ID.
 * @param {String} projectId - Id of project.
 * @return {Project} Wanted project.
 */
export function getProjectById(projectId) {
  const projects = getProjects();
  return projects[projectId];
}

/**
 * Get name of remote repository or local project if it is not based upon a remote repository.
 * @param {String} projectId - Id of project.
 * @return {String} Project Name.
 */
export function getProjectName(projectId) {
  const projects = getProjects();
  if (projects[projectId]?.git) {
    const { repository } = projects[projectId].git;
    return repository.split('/').at(-1);
  }
  return projectId;
}

/**
 * Save the project state.
 * @param {Project} project - Project to save.
 */
export function saveProject(project) {
  const projects = getProjects();
  projects[project.id] = project;
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Save project and initialize git in local storage.
 * @param {Project} project - Project to save.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export function initProject(project) {
  saveProject(project);
  return git.init({ fs, dir: `/${project.id}` });
}

/**
 * Clone and save project from git in local storage.
 * @param {Project} project - Project to save.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export function importProject(project) {
  return git.clone({
    fs,
    http,
    url: project.git.repository,
    dir: `/${project.id}`,
    onAuth: () => ({
      username: project.git.username,
      password: project.git.token,
    }),
    corsProxy: process.env.CORS_ISOMORPHIC_BASE_URL,
    singleBranch: true,
    depth: 1,
  }).then(() => saveProject(project));
}

/**
 * Clear one project by ID.
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
 * @param {Project} project - Project to update.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitFetch(project) {
  if (project.git && project.git.repository) {
    await git.fetch({
      fs,
      http,
      url: project.git.repository,
      dir: `/${project.id}`,
      onAuth: () => ({
        username: project.git.username,
        password: project.git.token,
      }),
      corsProxy: process.env.CORS_ISOMORPHIC_BASE_URL,
    }).catch(() => Promise.resolve());
  }
}

/**
 * Check if path is directory or not.
 * @param {String} path - Path to check.
 * @return {Promise<Boolean>} Promise with boolean on success otherwise an error.
 */
async function isDirectory(path) {
  const stat = await new Promise((resolve) => {
    fs.stat(
      path,
      (e, rv) => resolve(rv),
    );
  });
  return stat ? stat.isDirectory() : false;
}

/**
 * Get the list file/directory found in path location.
 * @param {String} path - Path to check.
 * @return {Promise<String[]>} Promise with array of strings on success otherwise an error.
 */
async function readDir(path) {
  return new Promise((resolve) => {
    fs.readdir(
      path,
      (e, rv) => resolve(rv),
    );
  });
}

/**
 * Get the list file/directory found in path location.
 * @param {String[]} files - Array of file to fill.
 * @param {String} projectId - ID of the project.
 * @param {String} filename - Path of file or directory. Null for root location.
 */
async function setFiles(files, projectId, filename) {
  const path = filename ? `${projectId}/${filename}` : projectId;
  const isDir = await isDirectory(path);
  if (isDir) {
    const dirFiles = await readDir(path);

    if (dirFiles.length === 0) {
      // Make empty folder visible by the FileExplorer.
      // TODO: Refacto when FileInformation have isFolder property.
      files.push(new FileInformation({ path: `${filename}/__empty__` }));
    }

    await Promise.allSettled(dirFiles.filter((file) => file !== '.git').map((file) => setFiles(
      files,
      projectId,
      filename ? `${filename}/${file}` : file,
    )));
  } else {
    files.push(new FileInformation({ path: filename }));
  }
}

/**
 * Retrieve list of project files name.
 * @param {String} projectId - Id of project.
 * @return {Promise<FileInformation[]>} Promise with file names array on success,
 * otherwise error.
 */
export async function getProjectFiles(projectId) {
  const files = [];
  await setFiles(files, projectId);
  return files;
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
 * Get file content.
 * @param {String} projectId - Id of project.
 * @param {FileInformation} fileInformation - Object that contain file path.
 * @return {Promise<FileInput>} Promise with file content on success otherwise error.
 */
export async function readProjectFile(projectId, fileInformation) {
  const content = await new Promise((resolve) => {
    fs.readFile(
      `/${projectId}/${fileInformation.path}`,
      'utf8',
      (e, rv) => resolve(rv),
    );
  });

  return new FileInput({
    path: fileInformation.path,
    content,
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

/**
 * Create a new directory.
 * @param {String} projectId - Id of project.
 * @param {String} path - Path of the folder to create.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function createProjectFolder(projectId, path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(`${projectId}/${path}`, (error) => {
      if (error) {
        reject({ name: error.code, message: error.message });
      } else {
        FileEvent.CreateFileEvent.next({
          name: path.substring(path.lastIndexOf('/') + 1),
          isFolder: true,
          path,
        });
        resolve();
      }
    });
  });
}

/**
 * Write new content inside given file.
 * Create the file if not existing.
 * @param {String} projectId - Id of project.
 * @param {FileInput} file - File input.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function writeProjectFile(projectId, file) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      `${projectId}/${file.path}`,
      file.content,
      'utf8',
      (error) => {
        if (error) {
          reject({ name: error.code, message: error.message });
        } else {
          resolve();
        }
      },
    );
  });
}

/**
 * Update remote origin, fetch and checkout the default branch.
 * @param {Project} project - Project to update.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitAddRemote(project) {
  await git.addRemote({
    fs,
    dir: `/${project.id}`,
    url: project.git.repository,
    remote: 'origin',
    force: true,
  });
}

/**
 * Checkout branch.
 * @param {String} projectId - Id of project.
 * @param {String} branch - Branch name to checkout.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitCheckout(projectId, branch) {
  await git.checkout({
    fs,
    dir: `/${projectId}`,
    ref: branch,
  }).catch(({ name }) => Promise.reject({ name }));
}

/**
 * Create branch from another branch.
 * @param {String} projectId - Id of project.
 * @param {String} newBranchName - New branch name.
 * @param {String} branchName - Branch name.
 * @param {Boolean} haveToCheckout - Indicate if checkout on new branch has to be done.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function createBranchFrom(projectId, newBranchName, branchName) {
  await git.branch({
    fs,
    dir: `/${projectId}`,
    ref: newBranchName,
    object: branchName,
  }).catch(({ name, message }) => {
    if (message.indexOf('ENOTDIR: File is not a directory.') >= 0) {
      return Promise.reject({ name: 'cannotLockRef', message });
    }
    return Promise.reject({ name, message });
  });
}

/**
 * Add untracked, unstaged or modified files.
 * @param {String} projectId - Id of project.
 * @param {String} filepath - Path of the file to add.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitAdd(projectId, filepath) {
  return git.add({
    fs,
    dir: `/${projectId}`,
    filepath,
  });
}

/**
 * Update selected branch with git pull.
 * @param {Project} project - Project to update.
 * @param {String} branchName - Branch name.
 * @param {Boolean} fastForward - State of fast forward option.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitUpdate(project, branchName, fastForward) {
  await git.pull({
    fs,
    http,
    dir: `/${project.id}`,
    ref: branchName,
    fastForward,
    singleBranch: true,
    onAuth: () => ({
      username: project.git.username,
      password: project.git.token,
    }),
    // TODO: Change when we have user information.
    author: {
      name: 'LetoModelizer',
      email: 'LetoModelizer@no-reply.com',
    },
    corsProxy: process.env.CORS_ISOMORPHIC_BASE_URL,
  });
}

/**
 * Delete folder on fs.
 * @param {String} path - Path of folder to delete.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function rmDir(path) {
  return new Promise((resolve, reject) => {
    fs.rmdir(
      path,
      (e) => (e ? reject(e) : resolve()),
    );
  });
}

/**
 * Delete file or link on fs.
 * @param {String} path - Path of file/link to delete.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function rm(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(
      path,
      (e) => (e ? reject(e) : resolve()),
    );
  });
}

/**
 * Delete project file or folder.
 * @param {String} projectId - Id of project.
 * @param {String} file - File path to delete.
 * @param {Boolean} isFolder - Indicates if it is a folder.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function deleteProjectFile(projectId, filePath, deleteFolder) {
  const isFolder = await isDirectory(`${projectId}/${filePath}`);

  if (isFolder) {
    const dirFiles = await readDir(`${projectId}/${filePath}`);

    if (dirFiles.length > 0) {
      await Promise.allSettled(dirFiles.map((fileName) => deleteProjectFile(projectId, `${filePath}/${fileName}`, true)));
    }
    await rmDir(`${projectId}/${filePath}`);
  } else {
    await rm(`${projectId}/${filePath}`);
  }

  const index = filePath.lastIndexOf('/');

  if (index !== -1 && !deleteFolder) {
    const parentPath = filePath.slice(0, index);
    const dirFiles = await readDir(`${projectId}/${parentPath}`);

    if (dirFiles.length > 0) {
      await writeProjectFile(projectId, { path: `${parentPath}/__empty__`, content: '' });
    }
  }
}

/**
 * Get the status of all files. If filePaths is defined, get the status of the files
 * that strictly or partially match the given filePaths.
 * @param {String} projectId - Id of project.
 * @param {String[]} filepaths - Limit the query to the given files and directories.
 * @param {Function} filter - Filter to only return results whose filepath matches a given function.
 * @return {Promise<FileStatus[]>} All files status.
 */
export async function getStatus(projectId, filepaths, filter) {
  return git.statusMatrix({
    fs,
    dir: `/${projectId}`,
    filepaths,
    filter,
  }).then((files) => files
    .map((file) => new FileStatus({
      path: file[0],
      headStatus: file[1],
      workdirStatus: file[2],
      stageStatus: file[3],
    })));
}
/**
 * Push selected branch on server.
 * @param {Project} project - Project.
 * @param {String} branchName - Branch name.
 * @param {Boolean} force - State of force option.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitPush(project, branchName, force) {
  await git.push({
    fs,
    http,
    dir: `/${project.id}`,
    remote: 'origin',
    ref: branchName,
    force,
    onAuth: () => ({
      username: project.git.username,
      password: project.git.token,
    }),
    corsProxy: process.env.CORS_ISOMORPHIC_BASE_URL,
  });
}

/**
 * Commit all staged files.
 * @param {String} projectId - Id of project.
 * @param {String} message - Commit message.
 * @return {Promise<void>} Promise with the SHA-1 object id of the newly created commit on success
 * otherwise an error.
 */
export async function gitCommit(projectId, message) {
  return git.commit({
    fs,
    dir: `/${projectId}`,
    // TODO: Change when we have user information.
    author: {
      name: 'LetoModelizer',
      email: 'LetoModelizer@no-reply.com',
    },
    message,
  });
}

/**
 * Save all modifications on the new branch and push it.
 * @param {Object} project - Object containing all information about the project.
 */
export async function gitGlobalSave(project) {
  const nowDate = new Date();
  const currentBranch = await getCurrentBranch(project.id);
  const newBranch = `leto-modelizer_${nowDate.getTime()}`;

  await createBranchFrom(
    project.id,
    newBranch,
    currentBranch,
  );

  await gitCheckout(project.id, newBranch);

  const files = (await getStatus(project.id))
    .filter((file) => file.hasUnstagedChanged
      || file.isUntracked
      || file.isUnstaged
      || file.isStaged)
    .map((file) => file.path);

  await gitAdd(project.id, files);

  await gitCommit(
    project.id,
    `leto-modelizer ${nowDate.toDateString()}`,
  );

  await gitPush(
    project,
    newBranch,
    true,
  );

  return FileEvent.GlobalSaveFilesEvent.next();
}

/**
 * Get all logs from git log.
 * @param {String} projectId - Id of project.
 * @param {String} ref - The commit to begin walking backwards through the history from.
 * @param {Number} [depth=25] - Number of log to retrieve.
 * @return {Promise<ReadCommitResult[]>} Promise with logs on success otherwise an error.
 * @see https://isomorphic-git.org/docs/en/log
 */
export async function gitLog(projectId, ref, depth = 25) {
  return git.log({
    fs,
    dir: `/${projectId}`,
    depth,
    ref,
  });
}
