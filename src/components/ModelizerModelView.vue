<template>
  <q-layout
    view="lhh lpr lff"
    class="modelizer-model-view"
    data-cy="modelizer-model-view"
  >
    <component-definitions-drawer
      :plugins="data.plugins"
    />
    <q-page-container>
      <q-page>
        <div id='root' data-cy="modelizer-model-view-draw-root"></div>
      </q-page>
    </q-page-container>
    <component-detail-panel />
  </q-layout>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  reactive,
} from 'vue';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer';
import ComponentDetailPanel from 'components/drawer/ComponentDetailPanel';
import {
  getPlugins,
} from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getProjectFiles, readProjectFile } from 'src/composables/Project';

let pluginInitSubscription;
let pluginDeleteSubscription;
let pluginParseSubscription;
let pluginDrawSubscription;

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const data = reactive({
  plugins: [],
});

/**
 * Get array of FileInput from array of FileInformation if parsable by plugin.
 * @param {Object} plugin - Used to parse if possible.
 * @param {FileInformation[]} fileInformations - Array to parse.
 * @return {Promise<Array<FileInput>>} Promise with FileInputs array on success otherwise an error.
 */
async function getFileInputs(plugin, fileInformations) {
  return Promise.allSettled(
    fileInformations
      .filter((fileInfo) => plugin.isParsable(fileInfo))
      .map((fileInfo) => readProjectFile(props.projectName, fileInfo)),
  ).then((allResults) => allResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value));
}

/**
 * Update and draw new components.
 * @param {Object} plugin - Contens components to update and draw.
 */
async function drawComponents(plugin) {
  const fileInformations = await getProjectFiles(props.projectName);
  const fileInputs = await getFileInputs(plugin, fileInformations);
  plugin.parse(fileInputs);
  plugin.draw('root');
}

/**
 * Search a component to delete among all the components of all the plugins.
 * @param {Object} event - Object containing id of the component to delete.
 * @param {String} event.id - Id of the component to remove
 */
function deletePluginComponentAndRedraw(event) {
  data.plugins.forEach((plugin) => {
    plugin.data.removeComponentById(event.id);
    plugin.draw('root');
  });
}

/**
 * Update plugins array
 */
function updatePlugins() {
  data.plugins = getPlugins();
  data.plugins.forEach((plugin) => drawComponents(plugin));
}

onMounted(() => {
  updatePlugins();
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(updatePlugins);
  pluginDeleteSubscription = PluginEvent.DeleteEvent.subscribe(deletePluginComponentAndRedraw);
  pluginParseSubscription = PluginEvent.ParseEvent.subscribe(updatePlugins);
  pluginDrawSubscription = PluginEvent.DrawEvent.subscribe(updatePlugins);
});

onUnmounted(() => {
  pluginInitSubscription.unsubscribe();
  pluginDeleteSubscription.unsubscribe();
  pluginParseSubscription.unsubscribe();
  pluginDrawSubscription.unsubscribe();
});
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  #viewport {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

<style scoped>
  #root {
    height: 100vh;
    width: 100%;
  }
</style>
