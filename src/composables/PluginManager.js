import { readTextFile } from 'src/composables/Files';
import plugins from 'src/plugins';
import PluginEvent from 'src/composables/events/PluginEvent';

let instanciatePlugins = [];

/**
 * Initialize plugin metadata and definitions.
 *
 * @param {Object} plugin - instantiate plugin.
 */
export function initPluginMetadata(plugin) {
  plugin.metadata = new plugin.pluginModel.PluginMetadata();
  plugin.definitions = plugin.metadata.getDefinitions();
}

/**
 * Retreive files' informations.
 *
 * @param {Object} plugin - instantiate plugin.
 * @param {String} defType - Type of file to retreive.
 * @return {Array<Object>} Promise with files' information on success otherwise an error.
 */
export function getFilesInfo(plugin, defType) {
  return [...new Set(plugin.definitions[defType].reduce((acc, def) => {
    if (def.model) {
      acc.push({
        name: def.model,
        type: 'models',
        path: `/plugins/${plugin.name}/models/${def.model}.svg`,
      });
    }

    if (def.icon) {
      acc.push({
        name: def.icon,
        type: 'icons',
        path: `/plugins/${plugin.name}/icons/${def.icon}.svg`,
      });
    }

    return acc;
  }, []))];
}

// Remove if svg import is possible
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
 * Initialize plugin drawer.
 *
 * @param {Object} plugin - instantiate plugin
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function initPluginDrawer(plugin) {
  return createPluginResources(plugin)
    .then((resources) => {
      const events = {
        SelectEvent: PluginEvent.SelectEvent,
        EditEvent: PluginEvent.EditEvent,
        DeleteEvent: PluginEvent.DeleteEvent,
      };
      plugin.drawer = new plugin.pluginModel.PluginDrawer(resources, 'root', events);
    });
}

/**
 * Initialize plugin parser.
 *
 * @param {Object} plugin - instantiate plugin
 */
export function initPluginParser(plugin) {
  plugin.parser = new plugin.pluginModel.PluginParser(plugin.definitions);
}

/**
 * Initialize plugin renderer.
 *
 * @param {Object} plugin - instantiate plugin
 */
export function initPluginRenderer(plugin) {
  plugin.renderer = new plugin.pluginModel.PluginRenderer();
}

/**
 * Instantiate a plugin.
 *
 * @param {String} pluginName - Plugin name
 * @return {Promise<Plugin>} Promise with instanciated plugin on success otherwise an error.
 */
export async function instantiatePlugin(pluginName) {
  const pluginModel = plugins[pluginName];
  const plugin = {
    pluginModel,
    name: pluginName,
    components: [],
  };

  initPluginMetadata(plugin);
  initPluginParser(plugin);
  initPluginRenderer(plugin);
  await initPluginDrawer(plugin);

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
 * Get instantiated plugin correponding to the given name.
 *
 * @param {String} name - Name of the plugin to retrieve.
 * @return {Object} Return an array of plugin.
 */
export function getPluginByName(name) {
  return instanciatePlugins.find((p) => p.name === name);
}
