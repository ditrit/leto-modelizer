<template>
  <q-layout
    view="lhh lpr lff"
    class="modelizer-model-view"
    data-cy="modelizer-model-view"
  >
    <component-definitions-drawer
      :plugins="data.plugins"
      :templates="templates"
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
  ref,
} from 'vue';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer';
import ComponentDetailPanel from 'components/drawer/ComponentDetailPanel';
import {
  getPlugins,
  drawComponents,
} from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getTemplatesByType } from 'src/composables/TemplateManager';

let pluginInitSubscription;
let pluginParseSubscription;
let pluginDrawSubscription;
let pluginRenderSubscription;

const { t } = useI18n();
const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const data = reactive({
  plugins: [],
});
const templates = ref([]);

/**
 * Update plugins array and related component templates array.
 */
async function updatePluginsAndTemplates() {
  data.plugins = getPlugins();
  data.plugins.forEach((plugin) => drawComponents(plugin, props.projectName));
  await getTemplatesByType('component', data.plugins[0].data.name)
    .then((response) => {
      templates.value = response;
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.templates.getData'),
        html: true,
      });
    });
}

onMounted(() => {
  updatePluginsAndTemplates();
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(updatePluginsAndTemplates);
  pluginParseSubscription = PluginEvent.ParseEvent.subscribe(updatePluginsAndTemplates);
  pluginDrawSubscription = PluginEvent.DrawEvent.subscribe(updatePluginsAndTemplates);
  pluginRenderSubscription = PluginEvent.RenderEvent.subscribe(updatePluginsAndTemplates);
});

onUnmounted(() => {
  pluginInitSubscription.unsubscribe();
  pluginParseSubscription.unsubscribe();
  pluginDrawSubscription.unsubscribe();
  pluginRenderSubscription.unsubscribe();
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

<style lang="scss">
// Quasar sets overflow to 'hidden' on all svg.
// In our case, it needs to be set to 'visible' to manage position with % in plugin models.
div#root svg {
  overflow: visible !important;
}
</style>
