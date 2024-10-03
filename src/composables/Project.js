import * as BrowserFS from 'browserfs';
import {
  FileInformation,
  FileInput,
} from '@ditrit/leto-modelizer-plugin-core';
import {
  getFileInputs,
  getPlugins,
  getPluginByName,
} from 'src/composables/PluginManager';
import Project from 'src/models/Project';
import {
  gitListFiles,
  gitRemove,
  gitInit,
  gitAdd,
  gitCommit,
} from 'src/composables/Git';

const fs = BrowserFS.BFSRequire('fs');

export const PROJECT_STORAGE_KEY = 'projects';

/**
 * Represent a project object.
 * @typedef {object} Project
 * @property {string} id - project id.
 */

/**
 * Add a date to the project that does not contain one.
 * @param {object} projects - All projects.
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
 * @returns {object} Object that contains all project ids as keys and associated projects as values.
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
 * @param {string} projectId - Id of project.
 * @returns {Project} Wanted project.
 */
export function getProjectById(projectId) {
  const projects = getProjects();
  return projects[projectId];
}

/**
 * Extract project name from repository url.
 * @param {string} repositoryUrl - Repository url.
 * @returns {string} Project name.
 */
export function extractProjectName(repositoryUrl) {
  const regex = /.*\/([^.]*)(\.git)?$/;
  const match = regex.exec(repositoryUrl.replace(/\/$/, ''));

  return match?.[1] || null;
}

/**
 * Get name of remote repository or local project if it is not based upon a remote repository.
 * @param {string} projectId - Id of project.
 * @returns {string} Project Name.
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
  projects[project.id].creationDate = project.creationDate;
  projects[project.id].isFavorite = project.isFavorite;

  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Check if path is directory or not.
 * @param {string} path - Path to check.
 * @returns {Promise<boolean>} Promise with boolean on success otherwise an error.
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
 * @param {string} path - Path to check.
 * @returns {Promise<string[]>} Promise with array of strings on success otherwise an error.
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
 * @param {string[]} files - Array of file to fill.
 * @param {string} projectId - ID of the project.
 * @param {string} filename - Path of file or directory. Null for root location.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function setFiles(files, projectId, filename) {
  const path = filename ? `${projectId}/${filename}` : projectId;
  const isDir = await isDirectory(path);

  if (isDir) {
    const dirFiles = await readDir(path);

    if (dirFiles.length === 0) {
      // Make empty folder visible by the FileExplorer.
      // TODO: Refacto when FileInformation have isFolder property.
      files.push(new FileInformation({ path: `${projectId}/${filename}/__empty__` }));
    }

    await Promise.allSettled(dirFiles.filter((file) => file !== '.git').map((file) => setFiles(
      files,
      projectId,
      filename ? `${filename}/${file}` : file,
    )));
  } else {
    files.push(new FileInformation({ path: `${projectId}/${filename}` }));
  }
}

/**
 * Retrieve list of project files name.
 * @param {string} projectId - Id of project.
 * @returns {Promise<FileInformation[]>} Promise with file names array on success,
 * otherwise error.
 */
export async function getProjectFiles(projectId) {
  const files = [];
  await setFiles(files, projectId);
  return files;
}

/**
 * Get file content.
 * @param {FileInformation} fileInformation - Object that contain file path.
 * @returns {Promise<FileInput>} Promise with file content on success otherwise error.
 */
export async function readProjectFile(fileInformation) {
  const content = await new Promise((resolve) => {
    fs.readFile(
      `/${fileInformation.path}`,
      'utf8',
      (e, rv) => resolve(rv),
    );
  });

  return new FileInput({ path: fileInformation.path, content });
}

/**
 * Create a new directory.
 * @param {string} path - Path of the folder to create.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
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
 * @param {string} path - Path of the folder to create.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function createProjectFolder(path) {
  return Promise.allSettled(path.split('/').reduce((acc, item, index) => {
    if (index > 0) {
      acc.push(`${acc[index - 1]}/${item}`);
    } else {
      acc.push(item);
    }

    return acc;
  }, []).map((folder) => mkdir(folder))).then((allResults) => {
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
 * @param {FileInput} file - File input.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function writeProjectFile(file) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      file.path,
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
 * @param {FileInput} file - File input to append.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function appendProjectFile(file) {
  if (file.path.indexOf('/') > 0) {
    const folder = file.path.substring(0, file.path.lastIndexOf('/'));

    await createProjectFolder(folder);
  }

  return new Promise((resolve, reject) => {
    fs.appendFile(
      `/${file.path}`,
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
 * Delete folder on fs.
 * @param {string} path - Path of folder to delete.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
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
 * @param {string} path - Path of file/link to delete.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
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
 * @param {string} oldPath - Old path of file to rename.
 * @param {string} newPath - New path of file to rename.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
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
 * @param {string} path - Path of folder to delete.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
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
 * @param {string} projectId - Id of project.
 * @param {string} filePath - File path to delete.
 * @param {boolean} deleteParentFolder - Indicates if the parent folder should be deleted.
 * Otherwise create a fake file so that the file explorer will continue to display it.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function deleteProjectFile(projectId, filePath, deleteParentFolder) {
  const isFolder = await isDirectory(filePath);

  if (isFolder) {
    const dirFiles = await readDir(filePath);

    if (dirFiles.length > 0) {
      await Promise.allSettled(dirFiles.map((fileName) => deleteProjectFile(projectId, `${filePath}/${fileName}`, true)));
    }

    await rmDir(filePath);
  } else {
    await rm(filePath);
  }

  const listFiles = await gitListFiles(projectId);

  // gitRemove is used to stage a deleted file (behavior from isomorphic-git)
  if (listFiles.includes(filePath)) {
    await gitRemove(projectId, filePath);
  }

  const index = filePath.lastIndexOf('/');

  if (index !== -1 && !deleteParentFolder) {
    const parentPath = filePath.slice(0, index);
    const dirFiles = await readDir(parentPath);

    if (dirFiles.length > 0) {
      await writeProjectFile({ path: `${parentPath}/__empty__`, content: '' });
    }
  }
}

/**
 * Delete diagram parsable file but keep folders.
 * @param {string} pluginName - Name of the plugin.
 * @param {string} projectId - Id of project.
 * @param {string} filePath - File path to delete.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function deleteDiagramFile(pluginName, projectId, filePath) {
  const plugin = getPluginByName(pluginName);
  const folder = filePath === '' ? projectId : `${projectId}/${filePath}`;
  const isFolder = plugin.configuration.isFolderTypeDiagram;
  const listFiles = await gitListFiles(projectId);

  let rmFiles;

  if (isFolder) {
    const dirFiles = await readDir(folder);

    rmFiles = dirFiles
      .filter((fileName) => plugin.isParsable({ path: fileName }))
      .map((fileName) => `${filePath}/${fileName}`);
  } else {
    rmFiles = [filePath];
  }

  await Promise.allSettled(rmFiles.map(async (fileName) => {
    await rm(`${projectId}/${fileName}`);

    // gitRemove is used to stage a deleted file (behavior from isomorphic-git)
    if (listFiles.includes(filePath)) {
      await gitRemove(projectId, filePath);
    }
  }));
}

/**
 * Save project and initialize git in local storage.
 * @param {Project} project - Project to save.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initProject(project) {
  saveProject(project);
  await gitInit(project.id);
  await writeProjectFile(new FileInput({
    path: `${project.id}/README.md`,
    content: `# ${project.id}\n`,
  }));
  await gitAdd(project.id, 'README.md');
  return gitCommit(project.id, 'Initial commit.');
}

/**
 * Get all models of the project.
 * @param {string} projectId - Id of project.
 * @returns {Promise<Array>} Promise with an array of models on success otherwise an error.
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
        path: path === projectId ? '' : path.replace(`${projectId}/`, ''),
        tags: plugin.configuration.tags.filter(({ type }) => type === 'category'),
      });
      index += 1;
    });
  });

  return models;
}

/**
 * Get model files.
 * @param {string} projectName - ID of the project.
 * @param {string} modelPath - Path of the models folder.
 * @param {object} plugin - Plugin to render.
 * @returns {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
export async function getModelFiles(projectName, modelPath, plugin) {
  const rootPath = modelPath === '' ? projectName : modelPath;
  const isFolder = plugin.configuration.isFolderTypeDiagram;

  let fileInformations;

  if (isFolder) {
    fileInformations = await readDir(rootPath)
      .then((files) => files.map((file) => new FileInformation({ path: `${rootPath}/${file}` })));
  } else {
    fileInformations = [new FileInformation({ path: `${projectName}/${modelPath}` })];
  }

  return getFileInputs(plugin, fileInformations);
}

/**
 * Delete one project by ID.
 * @param {string} projectId - Id of project.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function deleteProjectById(projectId) {
  const projects = getProjects();
  const files = await readDir(projectId);
  const projectFiles = files.map((file) => `${projectId}/${file}`);

  if (projects[projectId]) {
    await Promise.all(projectFiles.map((file) => deleteProjectFile(projectId, file, true)));
    await rmDir(projectId);

    delete projects[projectId];
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }
}

/**
 * Rename project.
 * @param {string} projectId - Id of project.
 * @param {string} newProjectName - Project new name.
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
 * @param {string} filter - Searched text.
 * @param {string} value - Value to match with.
 * @returns {boolean} true if it is matching otherwise false.
 */
export function isMatching(filter, value) {
  return !filter || filter.toLowerCase().trim().split(/\s+/)
    .some((searchedText) => value.toLowerCase().includes(searchedText));
}

/**
 * Check if the file at the given path exists.
 * @param {string} path - path to check.
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
