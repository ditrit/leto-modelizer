<template>
  <q-layout
    container
    class="modelizer-model-view"
    data-cy="modelizer-model-view"
  >
    <component-definitions-drawer
      v-if="data.plugin"
      :plugin="data.plugin"
      :templates="templates"
      :projectName="projectName"
    />
    <q-page-container>
      <q-page>
        <div id='root' data-cy="modelizer-model-view-draw-root"></div>
      </q-page>
    </q-page-container>
    <component-detail-panel
      v-if="data.plugin"
      :plugin="data.plugin"
    />
  </q-layout>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  reactive,
  ref,
  computed,
  watch,
} from 'vue';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer';
import ComponentDetailPanel from 'components/drawer/ComponentDetailPanel';
import {
  getFileInputs,
  getPluginByName,
  renderModel,
} from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import {
  readDir,
  readProjectFile,
} from 'src/composables/Project';
import { FileInformation } from 'leto-modelizer-plugin-core';
import { useRoute, useRouter } from 'vue-router';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';

const router = useRouter();
const route = useRoute();
const query = computed(() => route.query);

let pluginInitSubscription;
let pluginParseSubscription;
let pluginDrawSubscription;
let pluginRenderSubscription;
let pluginUpdateSubscription;
let viewSwitchSubscription;

const { t } = useI18n();
const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
const viewType = computed(() => route.params.viewType);

const data = reactive({
  plugin: null,
});
const templates = ref([]);
const defaultFolder = ref(process.env.MODELS_DEFAULT_FOLDER !== ''
  ? `${process.env.MODELS_DEFAULT_FOLDER}/`
  : '');

/**
 * Render the model.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function renderModelComponents() {
  const files = await renderModel(
    props.projectName,
    `${defaultFolder.value}${query.value.path}`,
    data.plugin,
  );

  PluginEvent.RenderEvent.next(files);
}

/**
 * Get all files of a folder.
 * @param {String} dir - Folder to check.
 * @return {Promise<FileInputs>} Promise with an array of files on success otherwise an error.
 */
async function getDirFiles(dir) {
  const files = await readDir(`${props.projectName}/${dir}`);
  const fileInformations = files.map((file) => new FileInformation({ path: `${dir}/${file}` }));

  return getFileInputs(data.plugin, fileInformations, props.projectName);
}

/**
 * Draw components.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function drawComponents() {
  const fileInputs = await getDirFiles(`${defaultFolder.value}${query.value.path}`);

  const config = await readProjectFile(
    props.projectName,
    new FileInformation({
      path: `${defaultFolder.value}${query.value.path}/leto-modelizer.config.json`,
    }),
  );

  data.plugin.parse(config, fileInputs);
  data.plugin.draw('root');
}

/**
 * Update plugins array and related component templates array.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updatePluginsAndTemplates() {
  if (!query.value || !query.value.path) {
    return;
  }

  const pluginName = query.value.path.split('/')[0];
  data.plugin = getPluginByName(pluginName);

  drawComponents();

  await getTemplatesByType('component', data.plugin.data.name)
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

/**
 * Redirect to text view with model path.
 * @param {String} newViewType - New viewType.
 */
async function onSwitchView(newViewType) {
  if (newViewType === 'text') {
    router.push({
      name: 'modelizer',
      params: {
        viewType: newViewType,
        projectName: props.projectName,
      },
      query: query.value,
    });
  }
}

watch(() => viewType.value, () => {
  if (viewType.value === 'model') {
    updatePluginsAndTemplates();
  }
});

onMounted(() => {
  updatePluginsAndTemplates();
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(updatePluginsAndTemplates);
  pluginParseSubscription = PluginEvent.ParseEvent.subscribe(updatePluginsAndTemplates);
  pluginDrawSubscription = PluginEvent.DrawEvent.subscribe(updatePluginsAndTemplates);
  pluginUpdateSubscription = PluginEvent.UpdateEvent.subscribe(renderModelComponents);
  pluginRenderSubscription = PluginEvent.RenderEvent.subscribe(updatePluginsAndTemplates);

  viewSwitchSubscription = ViewSwitchEvent.subscribe(onSwitchView);
});

onUnmounted(() => {
  pluginInitSubscription.unsubscribe();
  pluginParseSubscription.unsubscribe();
  pluginDrawSubscription.unsubscribe();
  pluginRenderSubscription.unsubscribe();
  pluginUpdateSubscription.unsubscribe();

  viewSwitchSubscription.unsubscribe();
});
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /**
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(updatePluginsAndTemplates);
     * Draw components.
     */
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
    height: calc(100vh - 74px);
    width: 100%;
  }
  .modelizer-model-view {
      height: calc(100vh - 64px)
  }
</style>

<style lang="scss">
// Quasar sets overflow to 'hidden' on all svg.
// In our case, it needs to be set to 'visible' to manage position with % in plugin models.
div#root svg {
  overflow: visible !important;
  display: unset;
  height: 100%;
  width: 100%;
}
</style>
