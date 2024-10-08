import { readTextFile } from 'src/composables/Files';
import plugins from 'src/plugins';
import { FileInformation, FileInput } from '@ditrit/leto-modelizer-plugin-core';
import {
  writeProjectFile,
  readProjectFile,
  getModelFiles,
  deleteProjectFile,
  readDir,
  appendProjectFile,
  setFiles,
} from 'src/composables/Project';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getTemplateFiles } from 'src/services/TemplateService';

const configurationFileName = 'leto-modelizer.config.json';
const intervalTime = 5 * 60 * 1000; // 5 min
let instanciatePlugins = [];

/**
 * Delete all event logs before the specified datetime.
 */
function deleteOldEvents() {
  instanciatePlugins.forEach((plugin) => {
    plugin.data.deleteAllEventLogsBefore(Date.now() - intervalTime);
  });
}

/**
 * Retrieve files' information.
 * @param {object} plugin - Instantiate plugin.
 * @returns {Array<object>} Promise with files' information on success otherwise an error.
 */
export function getFilesInfo(plugin) {
  const files = plugin.data.definitions.components.reduce((acc, definition) => {
    if (definition.model) {
      acc[`models_${definition.model}`] = {
        name: definition.model,
        type: 'models',
        path: `/plugins/${plugin.data.name}/models/${definition.model}.svg`,
      };
    }
    if (definition.icon) {
      acc[`icons_${definition.icon}`] = {
        name: definition.icon,
        type: 'icons',
        path: `/plugins/${plugin.data.name}/icons/${definition.icon}.svg`,
      };
    }
    return acc;
  }, {});

  plugin.configuration.extraResources.forEach((resource) => {
    files[`${resource.type}_${resource.name}`] = {
      name: resource.name,
      type: resource.type,
      path: `/plugins/${plugin.data.name}/${resource.type}/${resource.name}.svg`,
    };
  });

  files.style_style = {
    name: 'style',
    type: 'style',
    path: `/plugins/${plugin.data.name}/style.css`,
  };

  return Object.keys(files).map((key) => files[key]);
}

// TODO: Remove if svg import is possible
/**
 * Create plugin resources.
 * @param {object} plugin - Instantiate plugin.
 * @returns {Promise<object>} Promise with resources on success otherwise an error.
 */
export async function createPluginResources(plugin) {
  const files = getFilesInfo(plugin);

  return Promise.allSettled(
    files.map((file) => readTextFile(file.path).then((content) => ({ ...file, content }))),
  ).then((allresults) => allresults
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)
    .reduce((acc, file) => {
      if (file.type === 'style') {
        acc.style = file.content;
      } else {
        acc[file.type][file.name] = file.content;
      }
      return acc;
    }, {
      icons: {},
      models: {},
      markers: {},
      links: {},
    }));
}

/**
 * Instantiate a plugin.
 * @param {string} pluginName - Plugin name.
 * @returns {Promise<Plugin>} Promise with instanciated plugin on success otherwise an error.
 */
export async function instantiatePlugin(pluginName) {
  const plugin = new plugins[pluginName]({
    event: PluginEvent.DefaultEvent,
  });

  plugin.init();

  await createPluginResources(plugin).then((resources) => {
    plugin.initResources(resources);
  });

  return plugin;
}

/**
 * Instantiate all plugins available.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initPlugins() {
  return Promise.allSettled(Object.keys(plugins).map(instantiatePlugin))
    .then((allresults) => {
      instanciatePlugins = allresults
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

      setInterval(deleteOldEvents, intervalTime);
    });
}

/**
 * Get all the instantiated plugins.
 * @returns {Array<Plugin>} Return an array of plugin.
 */
export function getPlugins() {
  return instanciatePlugins;
}

/**
 * Get instantiated plugin corresponding to the given name.
 * @param {string} name - Name of the plugin to retrieve.
 * @returns {object} Return a plugin otherwise undefined.
 */
export function getPluginByName(name) {
  return instanciatePlugins.find((plugin) => plugin.data.name === name);
}

/**
 * Get the list of tags related to a given plugin.
 * @param {string} name - Name of the given plugin.
 * @returns {Array<Tag>} Return an array of tags otherwise an empty array.
 */
export function getPluginTags(name) {
  return getPluginByName(name)?.configuration.tags || [];
}

/**
 * Get the list of tags by type from all plugins.
 * @param {string} type - Type of the tag.
 * @returns {Array<Tag>} Return an array of tags.
 */
export function getAllTagsByType(type) {
  return [...new Set(
    getPlugins()
      .flatMap(({ configuration }) => configuration.tags)
      .filter((tag) => tag.type === type)
      .map(({ value }) => value),
  )].sort();
}

/**
 * Check if a file is parsable by plugin.
 * @param {FileInformation} file - File to check.
 * @returns {boolean} Return true if file is parsable, otherwise false.
 */
export function isParsableFile(file) {
  return instanciatePlugins.some((plugin) => plugin.isParsable(file));
}

/**
 * Update project files or delete them if their contents are empty.
 * If there are no more files to update, we keep at least one empty file.
 * @param {object} plugin - Plugin to render.
 * @param {FileInput[]} renderedFiles - All rendered files from the plugin.
 * @param {boolean} isFolder - True if diagram is type folder.
 * @param {string} projectId - ID of the project.
 * @param {string} modelPath - Path of the model.
 * @returns {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
function updateFilesInProject(
  plugin,
  renderedFiles,
  isFolder,
  projectId,
  modelPath,
) {
  const filesToUpdate = [];
  const unparsableFiles = [];
  let filesToDelete = [];

  renderedFiles.forEach((file) => {
    if (plugin.isParsable(file)) {
      if (file.content !== null) {
        filesToUpdate.push(file);
      } else {
        filesToDelete.push(file);
      }
    } else {
      unparsableFiles.push(file);
    }
  });

  if (filesToUpdate.length === 0) {
    if (isFolder) {
      const originPath = modelPath ? `${projectId}/${modelPath}` : projectId;

      filesToUpdate.push(new FileInformation({ path: `${originPath}/${plugin.configuration.defaultFileName}`, content: '' }));
      filesToDelete = filesToDelete.filter(({ path }) => path !== `${originPath}/${plugin.configuration.defaultFileName}`);
    } else {
      filesToUpdate.push(filesToDelete.pop());
    }
  }

  filesToUpdate.push(...unparsableFiles);

  return Promise.allSettled([
    ...filesToDelete.map(({ path }) => deleteProjectFile(projectId, path)),
    ...filesToUpdate.map((file) => writeProjectFile(file)),
  ]).then(() => filesToUpdate);
}

/**
 * Render the given model with the corresponding plugin.
 * Return rendered files.
 * @param {string} projectId - ID of the project.
 * @param {string} modelPath - Path of the model.
 * @param {object} plugin - Plugin to render.
 * @returns {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
export async function renderModel(projectId, modelPath, plugin) {
  const isFolder = plugin.configuration.isFolderTypeDiagram;
  const modelFolder = modelPath === '' ? projectId : `${projectId}/${modelPath}`;

  const config = await readProjectFile(
    new FileInformation({
      path: `${projectId}/${configurationFileName}`,
    }),
  );
  const files = isFolder
    ? await getModelFiles(projectId, modelFolder, plugin)
    : [new FileInput({ path: modelFolder })];

  const diagramFile = new FileInformation({ path: modelFolder });

  const renderedFiles = plugin.render(
    diagramFile,
    config,
    files.filter((file) => plugin.isParsable(file)),
  );

  return updateFilesInProject(plugin, renderedFiles, isFolder, projectId, modelPath);
}

/**
 * Render the configuration file.
 * @param {string} projectId - ID of the project.
 * @param {string} modelPath - Path of the model.
 * @param {object} plugin - Plugin to render.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function renderConfiguration(projectId, modelPath, plugin) {
  const config = await readProjectFile(
    new FileInformation({
      path: `${projectId}/${configurationFileName}`,
    }),
  );

  // TODO : replace by appropriate function when it's done in plugin-core
  // eslint-disable-next-line no-underscore-dangle
  plugin.__renderer.renderConfiguration(new FileInformation({ path: modelPath ? `${projectId}/${modelPath}` : projectId }), config);

  await writeProjectFile(config);
}

/**
 * Get array of FileInput from array of FileInformation if parsable by plugin.
 * @param {object} plugin - Used to parse if possible.
 * @param {FileInformation[]} fileInformations - Array to parse.
 * @returns {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
export async function getFileInputs(plugin, fileInformations) {
  return Promise.allSettled(
    fileInformations
      .filter((fileInfo) => plugin.isParsable(fileInfo))
      .map((fileInfo) => readProjectFile(fileInfo)),
  ).then((allResults) => allResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value));
}

/**
 * Get all files of a diagram.
 * @param {string} projectName - Project name.
 * @param {object} plugin - Plugin to get configuration and select files.
 * @param {string} diagramPath - Diagram path.
 * @returns {Promise<FileInput[]>} Promise that contains all diagram files.
 */
export async function getDiagramFiles(projectName, plugin, diagramPath) {
  let filesInformation;

  if (plugin.configuration.isFolderTypeDiagram) {
    filesInformation = [];

    await setFiles(filesInformation, projectName, diagramPath);

    filesInformation = filesInformation.filter((file) => plugin.isParsable(file));
  } else {
    filesInformation = [new FileInformation({ path: `${projectName}/${diagramPath}` })];
  }

  return getFileInputs(plugin, filesInformation);
}

/**
 * Init components.
 * @param {string} projectName - Name of the project.
 * @param {object} plugin - Plugin corresponding to the model.
 * @param {string} path - Model path.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initComponents(projectName, plugin, path) {
  const fileInputs = await getDiagramFiles(projectName, plugin, path);

  const config = await readProjectFile(
    new FileInformation({
      path: `${projectName}/${configurationFileName}`,
    }),
  );

  const diagram = new FileInformation({ path: path ? `${projectName}/${path}` : projectName });

  plugin.parse(diagram, config, fileInputs);

  return plugin.data.parseLogs;
}

/**
 * Analyze file and return all generated parser logs.
 * @param {FileInput} fileInput - File to analyze.
 * @returns {ParserLog[]} Logs to return.
 */
export function analyzeFile(fileInput) {
  const plugin = getPlugins().find((p) => p.isParsable(fileInput));

  if (!plugin) {
    return [];
  }

  const paths = fileInput.path.split('/');

  plugin.parse(
    new FileInformation({ path: paths.slice(0, -1).join('/') }),
    new FileInformation({
      path: `${paths[0]}/${configurationFileName}`,
    }),
    [fileInput],
  );

  return plugin.data.parseLogs;
}

/**
 * Add a new component from template.
 * Add the template files to the model folder
 * then parse all model files.
 * @param {string} projectName - Name of the project.
 * @param {object} plugin - Plugin corresponding to the model.
 * @param {string} path - Model path.
 * @param {object} templateDefinition - Definition of the template.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function addNewTemplateComponent(
  projectName,
  plugin,
  path,
  templateDefinition,
) {
  const templateFiles = await getTemplateFiles({
    HAS_BACKEND: process.env.HAS_BACKEND,
    TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
  }, templateDefinition);

  await Promise.allSettled(
    templateFiles.map((file) => {
      file.path = `${path}/${file.path}`;

      return appendProjectFile(file);
    }),
  );

  const files = await readDir(path);
  const fileInformations = files.map(
    (file) => new FileInformation({ path: `${path}/${file}` }),
  );
  const fileInputs = await getFileInputs(plugin, fileInformations);
  const config = await readProjectFile(
    new FileInformation({
      path: `${projectName}/${configurationFileName}`,
    }),
  );

  plugin.parse(new FileInformation({ path }), config, fileInputs);
}

/**
 * Get path of model corresponding to the file path.
 * @param {string} pluginName - Plugin name.
 * @param {string} path - File path.
 * @returns {string} Model path.
 */
export function getModelPath(pluginName, path) {
  return getPluginByName(pluginName).getModels([new FileInformation({ path })])[0];
}
