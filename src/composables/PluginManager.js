import { readTextFile } from 'src/composables/Files';
import plugins from 'src/plugins';
import PluginEvent from 'src/composables/events/PluginEvent';

let instanciatePlugins = [];

/**
 * Retrieve files' information.
 *
 * @param {Object} plugin - instantiate plugin.
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
 * @param {Object} plugin - instantiate plugin
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
 * @param {String} pluginName - Plugin name
 * @return {Promise<Plugin>} Promise with instanciated plugin on success otherwise an error.
 */
export async function instantiatePlugin(pluginName) {
  const plugin = new plugins[pluginName]();

  plugin.init({
    SelectEvent: PluginEvent.EditEvent,
    UpdateEvent: PluginEvent.UpdateEvent,
  });

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
 * @return {Object} Return an array of plugin.
 */
export function getPluginByName(name) {
  return instanciatePlugins.find((plugin) => plugin.data.name === name);
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
