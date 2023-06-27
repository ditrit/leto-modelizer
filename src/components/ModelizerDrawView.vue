<template>
  <q-layout
    container
    class="modelizer-draw-view"
    data-cy="modelizer-draw-view"
  >
    <component-definitions-drawer
      v-if="data.plugin"
      :plugin="data.plugin"
      :templates="templates"
      :project-name="projectName"
    />
    <q-page-container>
      <q-page class="bg-grey-3">
        <div
          id="root"
          data-cy="draw-container"
          @dragover.prevent
          @drop.prevent="dropHandler"
        >
          <component-drop-overlay />
        </div>
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
} from 'vue';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer';
import ComponentDetailPanel from 'components/drawer/ComponentDetailPanel';
import {
  getPluginByName,
  renderModel,
  renderConfiguration,
  addNewComponent,
  addNewTemplateComponent,
  initComponents,
} from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import ComponentDropOverlay from 'components/drawer/ComponentDropOverlay';
import { ComponentDrawOption } from 'leto-modelizer-plugin-core';

const route = useRoute();
const query = computed(() => route.query);

let pluginInitSubscription;
let pluginDefaultSubscription;

const { t } = useI18n();
const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const data = reactive({
  plugin: null,
});
const templates = ref([]);
const defaultFolder = ref(process.env.MODELS_DEFAULT_FOLDER !== ''
  ? `${process.env.MODELS_DEFAULT_FOLDER}/`
  : '');

/**
 * On 'Drawer' event type, call renderConfiguration if action is 'move',
 * otherwise call renderModel.
 * @param {Object} eventManager - Object containing event and plugin.
 * @param {Object} eventManager.event - The triggered event.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onDefaultEvent({ event }) {
  const renderModelActions = ['update', 'delete', 'add'];

  if (event.type === 'Drawer') {
    if (event.action === 'move') {
      await renderConfiguration(
        props.projectName,
        `${defaultFolder.value}${query.value.path}`,
        data.plugin,
      );
    } else if (renderModelActions.includes(event.action)) {
      await renderModel(
        props.projectName,
        `${defaultFolder.value}${query.value.path}`,
        data.plugin,
      );
    }
  }
}

/**
 * Update plugin, draw components and update component templates array.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function initView() {
  if (!query.value?.path) {
    return;
  }

  const pluginName = query.value.path.split('/')[0];
  data.plugin = getPluginByName(pluginName);

  if (!data.plugin) {
    return;
  }

  await Promise.allSettled([
    initComponents(
      route.params.projectName,
      data.plugin,
      `${defaultFolder.value}${route.query.path}`,
    ).then(() => {
      data.plugin.draw('root');
    }),
    getTemplatesByType(
      'component',
      data.plugin.data.name,
    ).then((response) => {
      templates.value = response;
    }).catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.templates.getData'),
        html: true,
      });
    }),
  ]);
}

/**
 * Get the coordinates to use for component draw options.
 * @param {Object} event - Cursor event when dropping a new component.
 * @param {Number} event.clientX - Position X of the cursor.
 * @param {Number} event.clientY - Position Y of the cursor.
 * @return {Object} The coordinates for new component.
 */
function getComponentPosition({ clientX, clientY }) {
  const { __drawer: drawer } = data.plugin;
  const { scale, translate } = drawer.actions.zoom;
  const { left: rootX, top: rootY } = document.querySelector('#root').getBoundingClientRect();

  return {
    x: ((clientX - rootX) - translate.x) / scale,
    y: ((clientY - rootY) - translate.y) / scale,
  };
}

/**
 * Instantiate from a dragged component definition or template.
 * @param {DragEvent} event - The drag event.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function dropHandler(event) {
  const dropData = JSON.parse(event.dataTransfer.getData('text/plain'));

  if (!dropData.isTemplate) {
    const componentDefinition = data.plugin.data.definitions.components
      .find(({ type }) => type === dropData.definitionType);

    await addNewComponent(
      route.params.projectName,
      data.plugin,
      `${defaultFolder.value}${route.query.path}`,
      componentDefinition,
      new ComponentDrawOption({ ...getComponentPosition(event) }),
    );
    data.plugin.draw('root');
  } else {
    const templateDefinition = templates.value.find(
      ({ key }) => key === dropData.definitionType,
    );

    await addNewTemplateComponent(
      route.params.projectName,
      data.plugin,
      `${defaultFolder.value}${route.query.path}`,
      templateDefinition,
    ).then(() => {
      data.plugin.draw('root');
    }).catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.templates.getData'),
        html: true,
      });
    });
  }
}

onMounted(async () => {
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(() => {
    initView();
  });
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe((event) => {
    onDefaultEvent(event);
  });

  await initView();
});

onUnmounted(() => {
  pluginInitSubscription.unsubscribe();
  pluginDefaultSubscription.unsubscribe();
});
</script>

<style scoped>
  #root {
    height: calc(100vh - 74px);
    width: 100%;
  }
  .modelizer-draw-view {
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
