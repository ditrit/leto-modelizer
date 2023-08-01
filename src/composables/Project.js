import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import * as BrowserFS from 'browserfs';
import {
  FileInformation,
  FileInput,
} from 'leto-modelizer-plugin-core';
import Branch from 'src/models/git/Branch';
import FileStatus from 'src/models/git/FileStatus';
import { getFileInputs, getPlugins, getPluginTags } from 'src/composables/PluginManager';
import Project from 'src/models/Project';

const fs = BrowserFS.BFSRequire('fs');

export const PROJECT_STORAGE_KEY = 'projects';

/**
 * Represent a project object.
 * @typedef {Object} Project
 * @property {String} id - project id.
 */

/**
 * Add a date to the project that does not contain one.
 * @param {Object} projects - All projects.
 * @todo Remove this function when leto-modelizer 1.2.0 is released.
 */
function addDateToProjects(projects) {
  let save = false;

  Object.entries(projects).forEach(([, projectValue]) => {
    if (!projectValue.creationDate) {
      projectValue.creationDate = Date.now();
      save = true;
    }
  });

  if (save) {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }
}

/**
 * Get a map of all projects.
 * @return {Object} Object that contains all project ids as keys and associated projects as values.
 */
export function getProjects() {
  const allProjects = JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY) || '{}');

  Object.keys(allProjects).forEach((key) => {
    allProjects[key] = new Project(allProjects[key]);
  });

  // TODO: Remove this function when leto-modelizer 1.2.0 is released.
  addDateToProjects(allProjects);

  return allProjects;
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
 * Extract project name from repository url.
 * @param {String} repositoryUrl - Repository url.
 * @returns {String|null} Project name.
 */
export function extractProjectName(repositoryUrl) {
  const regex = /\/([^/]+)\/?$/;
  const match = regex.exec(repositoryUrl);

  return match?.[1] || null;
}

/**
 * Get name of remote repository or local project if it is not based upon a remote repository.
 * @param {String} projectId - Id of project.
 * @return {String} Project Name.
 */
export function getProjectName(projectId) {
  const projects = getProjects();
  const { repository } = projects[projectId].git;

  if (repository) {
    return extractProjectName(repository);
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
  projects[project.id].creationDate = Date.now();
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Clone and save project from git in local storage.
 * @param {Project} project - Project to save.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function importProject(project) {
  return git.clone({
    fs,
    http,
    url: project.git.repository,
    dir: `/${project.id}`,
    onAuth: () => ({
      username: project.git.username,
      password: project.git.token,
    }),
    corsProxy: '/cors-proxy',
    singleBranch: true,
    depth: 1,
  }).then(() => saveProject(project));
}

/**
 * Fetch project on git.
 * Warning: It seems that `git.fetch` can throw unexpected error.
 * @param {Project} project - Project to update.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitFetch(project) {
  if (project.git?.repository) {
    return git.fetch({
      fs,
      http,
      url: project.git.repository,
      dir: `/${project.id}`,
      onAuth: () => ({
        username: project.git.username,
        password: project.git.token,
      }),
      corsProxy: '/cors-proxy',
    });
  }
  return Promise.resolve();
}

/**
 * Check if path is directory or not.
 * @param {String} path - Path to check.
 * @return {Promise<Boolean>} Promise with boolean on success otherwise an error.
 */
export async function isDirectory(path) {
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
export async function readDir(path) {
  return new Promise((resolve) => {
    fs.readdir(
      path,
      (e, rv) => resolve(rv),
    );
  });
}

/**
 * Get the list of file/directory found in path location.
 * @param {String[]} files - Array of file to fill.
 * @param {String} projectId - ID of the project.
 * @param {String} filename - Path of file or directory. Null for root location.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
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
 * Get the list of directory found in path location.
 * @param {String[]} files - Array of file to fill.
 * @param {String} projectId - ID of the project.
 * @param {String|null} filename - Path of file or directory. Null for root location.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function setFolders(files, projectId, filename) {
  const path = filename ? `${projectId}/${filename}` : projectId;
  const isDir = await isDirectory(path);

  if (isDir) {
    const dirFiles = await readDir(path);

    if (filename) {
      files.push(new FileInformation({ path: filename }));
    }

    await Promise.allSettled(dirFiles.filter((file) => file !== '.git').map((file) => setFolders(
      files,
      projectId,
      filename ? `${filename}/${file}` : file,
    )));
  }
}

/**
 * Retrieve list of project folder names.
 * @param {String} projectId - Id of project.
 * @return {Promise<FileInformation[]>} Promise with folder names array on success,
 * otherwise error.
 */
export async function getProjectFolders(projectId) {
  const files = [];
  await setFolders(files, projectId);
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

  return new FileInput({ path: fileInformation.path, content });
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
 * @param {String} path - Path of the folder to create.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function mkdir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (error) => {
      if (error) {
        reject({ name: error.code, message: error.message });
      } else {
        resolve();
      }
    });
  });
}

/**
 * Create a new directory and its parents if not existing. Ignore already existing error.
 * @param {String} projectId - Id of project.
 * @param {String} path - Path of the folder to create.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function createProjectFolder(projectId, path) {
  return Promise.allSettled(path.split('/').reduce((acc, item, index) => {
    if (index > 0) {
      acc.push(`${acc[index - 1]}/${item}`);
    } else {
      acc.push(item);
    }

    return acc;
  }, []).map((folder) => mkdir(`${projectId}/${folder}`))).then((allResults) => {
    const error = allResults.find(({ status, reason }) => status === 'rejected' && reason.name !== 'EEXIST');

    if (error) {
      return Promise.reject(error);
    }

    return Promise.resolve();
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
      file.content || '',
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
 * Append the given content to a file.
 * Create the file and folder if not existing.
 * @param {String} projectId - Id of project.
 * @param {FileInput} file - File input to append.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function appendProjectFile(projectId, file) {
  if (file.path.indexOf('/') > 0) {
    const folder = file.path.substring(0, file.path.lastIndexOf('/'));

    await createProjectFolder(projectId, folder);
  }

  return new Promise((resolve, reject) => {
    fs.appendFile(
      `${projectId}/${file.path}`,
      file.content || '',
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
 * Add (stage) deleted files.
 * @param {String} projectId - Id of project.
 * @param {String} filepath - Path of the file to add.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function gitRemove(projectId, filepath) {
  return git.remove({
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
    corsProxy: '/cors-proxy',
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
 * Rename file on fs.
 * @param {String} oldPath - Old path of file to rename.
 * @param {String} newPath - New path of file to rename.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function rename(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(
      oldPath,
      newPath,
      (e) => (e ? reject(e) : resolve()),
    );
  });
}

/**
 * Delete folder and all its content on fs.
 * @param {String} path - Path of folder to delete.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function deleteProjectDir(path) {
  const isDir = await isDirectory(path);

  if (!isDir) {
    return rm(path);
  }

  const dirEntries = await readDir(path);

  if (dirEntries.length > 0) {
    await Promise.allSettled(dirEntries.map((entry) => deleteProjectDir(`${path}/${entry}`)));
  }

  return rmDir(path);
}

/**
 * Delete project file or folder.
 * @param {String} projectId - Id of project.
 * @param {String} filePath - File path to delete.
 * @param {Boolean} deleteParentFolder - Indicates if the parent folder should be deleted.
 * Otherwise create a fake file so that the file explorer will continue to display it.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function deleteProjectFile(projectId, filePath, deleteParentFolder) {
  const isFolder = await isDirectory(`${projectId}/${filePath}`);

  if (isFolder) {
    const dirFiles = await readDir(`${projectId}/${filePath}`);

    if (dirFiles.length > 0) {
      await Promise.allSettled(dirFiles.map((fileName) => deleteProjectFile(projectId, `${filePath}/${fileName}`, true)));
    }

    await rmDir(`${projectId}/${filePath}`);
    // gitRemove is used to stage a deleted file (behavior from isomorphic-git)
    await gitRemove(projectId, `${filePath}`);
  } else {
    await rm(`${projectId}/${filePath}`);
    // gitRemove is used to stage a deleted file (behavior from isomorphic-git)
    await gitRemove(projectId, `${filePath}`);
  }

  const index = filePath.lastIndexOf('/');

  if (index !== -1 && !deleteParentFolder) {
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
    corsProxy: '/cors-proxy',
  });
}

/**
 * Commit all staged files.
 * @param {String} projectId - Id of project.
 * @param {String} message - Commit message.
 * @param {boolean} noUpdateBranchValue - If true, does not update the branch pointer
 * after creating the commit.
 * @return {Promise<void>} Promise with the SHA-1 object id of the newly created commit on success
 * otherwise an error.
 */
export async function gitCommit(projectId, message, noUpdateBranchValue = false) {
  return git.commit({
    fs,
    dir: `/${projectId}`,
    noUpdateBranch: noUpdateBranchValue,
    // TODO: Change when we have user information.
    author: {
      name: 'LetoModelizer',
      email: 'LetoModelizer@no-reply.com',
    },
    message,
  });
}

/**
 * Add and commit all modifications on the new branch and push it.
 * @param {Object} project - Object containing all information about the project.
 */
export async function gitGlobalUpload(project) {
  const nowDate = new Date();
  const newBranch = `leto-modelizer_${nowDate.getTime()}`;
  const files = (await getStatus(project.id));

  const modifiedFiles = files
    .filter((file) => file.hasUnstagedChanged
      || file.isUntracked
      || file.isUnstaged
      || file.isStaged)
    .map((file) => file.path);

  await gitAdd(project.id, modifiedFiles);

  /* Special case for deleted files.
  Unlike usual git, we CAN NOT add (git add) a deleted file,
  so here, the idea is to use the remove method of isomorphic-git to stage the
  deleted files.
  cf: https://github.com/isomorphic-git/isomorphic-git/issues/1099
  */
  const deletedfiles = files.filter((file) => file.isDeleted).map((file) => file.path);
  await gitRemove(project.id, deletedfiles);

  /*
  Commiting BEFORE creating a new branch.
  Again, due to some specific behavior in isomorphic-git, the modifications are not
  transfered (unlike usual git) while creating a new branch or doing a checkout.

  Creating the (orphan) commit before, give the possibility to create a new branch from that commit.
  Which will contains all modifications AND will be attached to the newly created branch.
  */
  const sha1 = await gitCommit(
    project.id,
    `leto-modelizer ${nowDate.toDateString()}`,
    true,
  );

  await createBranchFrom(
    project.id,
    newBranch,
    sha1,
  );

  await gitCheckout(project.id, newBranch);

  await gitPush(
    project,
    newBranch,
    true,
  );
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

/**
 * Save project and initialize git in local storage.
 * @param {Project} project - Project to save.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initProject(project) {
  saveProject(project);
  await git.init({ fs, dir: `/${project.id}` });
  await writeProjectFile(project.id, new FileInput({
    path: 'README.md',
    content: `# ${project.id}\n`,
  }));
  await gitAdd(project.id, 'README.md');
  return gitCommit(project.id, 'Initial commit.');
}

/**
 * Get all models of the plugin.
 * @param {String} modelsDefaultFolder - Path of the models folder.
 * @param {String} pluginName - Name of the plugin.
 * @return {Promise<Array>} Promise with an array of models on success otherwise an error.
 */
export async function getPluginModels(modelsdefaultFolder, pluginName) {
  const dirEntries = await readDir(`${modelsdefaultFolder}/${pluginName}`);

  if (!dirEntries) {
    return [];
  }

  return Promise.allSettled(dirEntries.map(
    (entry) => (async () => {
      const isDir = await isDirectory(`${modelsdefaultFolder}/${pluginName}/${entry}`);

      return isDir ? {
        name: entry,
        plugin: pluginName,
        tags: getPluginTags(pluginName),
        path: `${modelsdefaultFolder}/${pluginName}/${entry}`,
      } : null;
    })(),
  )).then((allResults) => allResults
    .filter((result) => result.status === 'fulfilled' && result.value)
    .map((result) => result.value));
}

/**
 * Get all models of the project.
 * @param {String} projectId - Id of project.
 * @return {Promise<Array>} Promise with an array of models on success otherwise an error.
 */
export async function getAllModels(projectId) {
  const plugins = getPlugins();
  const files = await getProjectFiles(projectId);
  const models = [];
  let index = 0;

  plugins.forEach((plugin) => {
    plugin.getModels(files).forEach((path) => {
      models.push({
        id: `diagram_${index}`,
        plugin: plugin.data.name,
        path,
        tags: plugin.configuration.tags.filter(({ type }) => type === 'category'),
      });
      index += 1;
    });
  });

  return models;
}

/**
 * Get model files.
 * @param {String} projectName - ID of the project.
 * @param {String} modelPath - Path of the models folder.
 * @param {Object} plugin - Plugin to render.
 * @return {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
export async function getModelFiles(projectName, modelPath, plugin) {
  if (!await isDirectory(`${projectName}/${modelPath}`)) {
    return getFileInputs(plugin, [new FileInformation({ path: modelPath })], projectName);
  }

  const files = await readDir(`${projectName}/${modelPath}`);
  const fileInformations = files.map((file) => new FileInformation({ path: `${modelPath}/${file}` }));

  return getFileInputs(plugin, fileInformations, projectName);
}

/**
* Delete one project by ID.
* @param {String} projectId - Id of project.
* @return {Promise<void>} Promise with nothing on success otherwise an error.
*/
export async function deleteProjectById(projectId) {
  const projects = getProjects();
  const projectFiles = await readDir(`/${projectId}`);

  if (projects[projectId]) {
    await Promise.all(projectFiles.map((file) => deleteProjectFile(projectId, file, true)));
    await rmDir(projectId);

    delete projects[projectId];
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }
}

/**
* Rename project.
* @param {String} projectId - Id of project.
* @param {String} newProjectName - Project new name.
*/
export async function renameProject(projectId, newProjectName) {
  await rename(`/${projectId}`, `/${newProjectName}`);

  const projects = getProjects();

  projects[newProjectName] = projects[projectId];
  projects[newProjectName].id = newProjectName;
  delete projects[projectId];
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Indicate if searched text is found.
 * @param {String} filter - Searched text.
 * @param {String} value - Value to match with.
 * @return {Boolean} true if it is matching otherwise false.
 */
export function isMatching(filter, value) {
  return !filter || filter.toLowerCase().trim().split(/\s+/)
    .some((searchedText) => value.toLowerCase().includes(searchedText));
}

/**
 * Check if the file at the given path exists.
 * @param {String} path - path to check.
 * @returns {Promise<boolean>} Promise with a boolean on success otherwise an error.
 */
export async function exists(path) {
  return new Promise((resolve) => {
    fs.exists(
      path,
      resolve,
    );
  });
}
