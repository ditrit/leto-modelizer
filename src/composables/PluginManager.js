import { readTextFile } from 'src/composables/Files';
import plugins from 'src/plugins';
import { FileInformation } from 'leto-modelizer-plugin-core';
import {
  writeProjectFile,
  readProjectFile,
  getModelFiles,
  deleteProjectFile,
  readDir,
  appendProjectFile,
  isDirectory,
} from 'src/composables/Project';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getTemplateFiles } from 'src/composables/TemplateManager';

const configurationFilePath = './leto-modelizer.config.json';
let instanciatePlugins = [];

/**
 * Retrieve files' information.
 *
 * @param {Object} plugin - Instantiate plugin.
 * @param {String} defType - Type of file to retrieve.
 * @return {Array<Object>} Promise with files' information on success otherwise an error.
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
 *
 * @param {Object} plugin - Instantiate plugin.
 * @return {Promise<Object>} Promise with resources on success otherwise an error.
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
 *
 * @param {String} pluginName - Plugin name.
 * @return {Promise<Plugin>} Promise with instanciated plugin on success otherwise an error.
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
 *
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initPlugins() {
  return Promise.allSettled(Object.keys(plugins).map(instantiatePlugin))
    .then((allresults) => {
      instanciatePlugins = allresults
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);
    });
}

/**
 * Get all the instantiated plugins.
 *
 * @return {Array<Plugin>} Return an array of plugin.
 */
export function getPlugins() {
  return instanciatePlugins;
}

/**
 * Get instantiated plugin corresponding to the given name.
 *
 * @param {String} name - Name of the plugin to retrieve.
 * @return {Object} Return a plugin otherwise undefined.
 */
export function getPluginByName(name) {
  return instanciatePlugins.find((plugin) => plugin.data.name === name);
}

/**
 * Get the list of tags related to a given plugin.
 *
 * @param {String} name - Name of the given plugin.
 * @return {Object} Return an array of tags otherwise an empty array.
 */
export function getPluginTags(name) {
  return getPluginByName(name)?.configuration.tags || [];
}

/**
 * Get all tags from all plugins.
 *
 * @return {Object} Return an array of tags.
 */
export function getAllTags() {
  return [...new Set(getPlugins().flatMap(({ configuration }) => configuration.tags))].sort();
}

/**
 * Check if a file is parsable by plugin.
 *
 * @param {FileInformation} file - File to check.
 * @return {Boolean} Return true if file is parsable, otherwise false.
 */
export function isParsableFile(file) {
  return instanciatePlugins.some((plugin) => plugin.isParsable(file));
}

/**
 * Render the given model with the corresponding pugin.
 * Return rendered files.
 * @param {String} projectId - ID of the project.
 * @param {String} modelPath - Path of the model folder.
 * @param {Object} plugin - Plugin to render.
 * @return {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
export async function renderModel(projectId, modelPath, plugin) {
  const modelFolder = await isDirectory(modelPath) ? modelPath : modelPath.substring(0, modelPath.lastIndexOf('/'));

  const config = await readProjectFile(
    projectId,
    new FileInformation({
      path: configurationFilePath,
    }),
  );
  const files = await getModelFiles(projectId, modelFolder, plugin);
  const renderFiles = plugin.render(
    new FileInformation({ path: modelPath }),
    config,
    files.filter((file) => plugin.isParsable(file)),
  );

  return Promise.allSettled(
    renderFiles.map((file) => {
      if (file.content) {
        return writeProjectFile(projectId, file);
      }

      return deleteProjectFile(projectId, file.path);
    }),
  ).then(() => renderFiles);
}

/**
 * Render the configuration file.
 * @param {String} projectId - ID of the project.
 * @param {String} modelPath - Path of the model.
 * @param {Object} plugin - Plugin to render.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function renderConfiguration(projectId, modelPath, plugin) {
  const config = await readProjectFile(
    projectId,
    new FileInformation({
      path: configurationFilePath,
    }),
  );

  // TODO : replace by appropriate function when it's done in plugin-core
  // eslint-disable-next-line no-underscore-dangle
  plugin.__renderer.renderConfiguration(new FileInformation({ path: modelPath }), config);

  await writeProjectFile(projectId, config);
}

/**
 * Get array of FileInput from array of FileInformation if parsable by plugin.
 *
 * @param {Object} plugin - Used to parse if possible.
 * @param {FileInformation[]} fileInformations - Array to parse.
 * @param {String} projectName - Project name.
 * @return {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
export async function getFileInputs(plugin, fileInformations, projectName) {
  return Promise.allSettled(
    fileInformations
      .filter((fileInfo) => plugin.isParsable(fileInfo))
      .map((fileInfo) => readProjectFile(projectName, fileInfo)),
  ).then((allResults) => allResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value));
}

/**
 * Init components.
 * @param {String} projectName - Name of the project.
 * @param {Object} plugin - Plugin corresponding to the model.
 * @param {String} path - Model path (Plugin name & model name).
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initComponents(projectName, plugin, path) {
  const dir = path;
  const files = await readDir(`${projectName}/${dir}`);
  const fileInformations = files
    .map((file) => new FileInformation({ path: `${dir}/${file}` }))
    .filter((file) => plugin.isParsable(file));

  const fileInputs = await getFileInputs(plugin, fileInformations, projectName);

  const config = await readProjectFile(
    projectName,
    new FileInformation({
      path: configurationFilePath,
    }),
  );

  plugin.parse(new FileInformation({ path }), config, fileInputs);
}

/**
 * Add a new component.
 * @param {String} projectName - Name of the project.
 * @param {Object} plugin - Plugin corresponding to the model.
 * @param {String} path - Model path (Plugin name & model name).
 * @param {Object} definition - Definition of the component.
 * @param {ComponentDrawOption} [drawOption=null] - drawOption of the component.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function addNewComponent(
  projectName,
  plugin,
  path,
  definition,
  drawOption = null,
) {
  const componentId = plugin.data.addComponent(definition, `${path}/`);
  const component = plugin.data.getComponentById(componentId);

  component.drawOption = drawOption;
}

/**
 * Add a new component from template.
 * Add the template files to the model folder
 * then parse all model files.
 * @param {String} projectName - Name of the project.
 * @param {Object} plugin - Plugin corresponding to the model.
 * @param {String} path - Model path (Plugin name & model name).
 * @param {Object} templateDefinition - Definition of the template.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function addNewTemplateComponent(
  projectName,
  plugin,
  path,
  templateDefinition,
) {
  const templateFiles = await getTemplateFiles(path, templateDefinition);

  await Promise.allSettled(
    templateFiles.map(
      (file) => appendProjectFile(
        projectName,
        file,
      ),
    ),
  );

  const files = await readDir(`${projectName}/${path}`);
  const fileInformations = files.map(
    (file) => new FileInformation({ path: `${path}/${file}` }),
  );
  const fileInputs = await getFileInputs(plugin, fileInformations, projectName);
  const config = await readProjectFile(
    projectName,
    new FileInformation({
      path: configurationFilePath,
    }),
  );

  plugin.parse(config, fileInputs);
}

/**
 * Get path of model from plugin and model file path.
 * @param {Object} plugin - Plugin corresponding to the model.
 * @param {String} path - File path.
 * @return {String} Model path.
 */
export function getModelPath(plugin, path) {
  return getPluginByName(plugin)
    .getModels([new FileInformation({ path })]).find(() => true);
}
