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
        <div id="viewport">
          <svg id='root' data-cy="modelizer-model-view-draw-root"></svg>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  reactive,
} from 'vue';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer';
import {
  deleteComponent,
  getPlugins,
} from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';

let pluginInitSubscription;
let pluginDeleteSubscription;
const data = reactive({
  plugins: [],
});

/**
 * Search a component to delete among all the components of all the plugins.
 * @param {Object} event - Object containing id of the component to delete.
 * @param {String} event.id - Id of the component to remove
 */
function deletePluginComponentAndRedraw(event) {
  const plugin = data.plugins.find(({ components }) => deleteComponent(event.id, components));

  if (plugin) {
    plugin.drawer.draw(plugin.components);
  }
}

/**
 * Update plugins array
 */
function updatePlugins() {
  data.plugins = getPlugins();
}

onMounted(() => {
  updatePlugins();
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(updatePlugins);
  pluginDeleteSubscription = PluginEvent.DeleteEvent.subscribe(deletePluginComponentAndRedraw);
});

onUnmounted(() => {
  pluginInitSubscription.unsubscribe();
  pluginDeleteSubscription.unsubscribe();
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
