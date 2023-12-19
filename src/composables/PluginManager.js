import { readTextFile } from 'src/composables/Files';
import plugins from 'src/plugins';
import { FileInformation, FileInput } from 'leto-modelizer-plugin-core';
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
import { getTemplateFiles } from 'src/composables/TemplateManager';

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
 * @param {string} defType - Type of file to retrieve.
 * @returns {Array<object>} Promise with files' information on success otherwise an error.
 */
export function getFilesInfo(plugin, defType) {
  return [...new Set(plugin.data.definitions[defType].reduce((acc, def) => {
    if (def.model) {
      acc.push({
        name: def.model,
        type: 'models',
        path: `/plugins/${plugin.data.name}/models/${def.model}.svg`,
      });
    }

    if (def.icon) {
      acc.push({
        name: def.icon,
        type: 'icons',
        path: `/plugins/${plugin.data.name}/icons/${def.icon}.svg`,
      });
    }

    return acc;
  }, []))];
}

// TODO: Remove if svg import is possible
/**
 * Create plugin resources.
 * @param {object} plugin - Instantiate plugin.
 * @returns {Promise<object>} Promise with resources on success otherwise an error.
 */
export async function createPluginResources(plugin) {
  const files = getFilesInfo(plugin, 'components');

  return Promise.allSettled(
    files.map((file) => readTextFile(file.path).then((content) => ({ ...file, content }))),
  ).then((allresults) => allresults
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)
    .reduce((acc, file) => {
      acc[file.type][file.name] = file.content;
      return acc;
    }, { icons: {}, models: {} }));
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
 * Render the given model with the corresponding pugin.
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
 * Init components.
 * @param {string} projectName - Name of the project.
 * @param {object} plugin - Plugin corresponding to the model.
 * @param {string} path - Model path.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initComponents(projectName, plugin, path) {
  let filesInformation;

  if (plugin.configuration.isFolderTypeDiagram) {
    filesInformation = [];

    await setFiles(filesInformation, projectName, path);

    filesInformation = filesInformation.filter((file) => plugin.isParsable(file));
  } else {
    filesInformation = [new FileInformation({ path: `${projectName}/${path}` })];
  }

  const fileInputs = await getFileInputs(plugin, filesInformation);

  const config = await readProjectFile(
    new FileInformation({
      path: `${projectName}/${configurationFileName}`,
    }),
  );

  const diagram = new FileInformation({ path: path ? `${projectName}/${path}` : projectName });

  plugin.parse(diagram, config, fileInputs);
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
  const templateFiles = await getTemplateFiles(path, templateDefinition);

  await Promise.allSettled(
    templateFiles.map((file) => appendProjectFile(file)),
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
 * @param {object} plugin - Plugin corresponding to the model.
 * @param {string} path - File path.
 * @returns {string} Model path.
 */
export function getModelPath(plugin, path) {
  return getPluginByName(plugin).getModels([new FileInformation({ path })])[0];
}
