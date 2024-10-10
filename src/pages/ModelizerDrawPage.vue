<template>
  <q-page
    class="row"
    :style-fn="getStyle"
  >
    <div class="column components-details-menu">
      <project-details-list :level="2" />
      <q-separator />
      <modelizer-draw-tab :offset="offset + 200" />
    </div>
    <q-separator vertical />
    <q-splitter
      v-model="splitter"
      :limits="[25, 100]"
      separator-class="separator-class"
      :class="['flex-1', isVisible ? '' : 'splitter-invisible']"
      :style="`height: calc(100vh - ${offset}px); max-height: calc(100vh - ${offset}px);`"
    >
      <template #before>
        <div
          id="view-port"
          data-cy="draw-container"
          class="column"
          @dragover.prevent
          @drop.prevent="dropHandler"
        />

        <div class="row sticky-actions">
          <q-btn
            class="q-mr-md"
            icon="fa-solid fa-sitemap"
            :label="$t('page.diagrams.actions.rearrange')"
            stack
            no-caps
            color="white"
            text-color="primary"
            data-cy="rearrange-button"
            @click="arrangeComponentsPosition()"
          />
          <q-btn
            class="q-mr-md"
            icon="fa-solid fa-image"
            :label="$t('page.diagrams.actions.export')"
            stack
            no-caps
            color="white"
            text-color="primary"
            data-cy="export-button"
            @click="exportSvg()"
          />
          <q-btn
            v-if="HAS_BACKEND"
            icon="fa-solid fa-brain"
            :label="$t('page.diagrams.actions.askAI')"
            stack
            no-caps
            color="white"
            text-color="primary"
            data-cy="askAI-button"
            @click="askAI()"
          />
        </div>
      </template>
      <template #after>
        <div
          v-if="isVisible"
          class="flex full-height scroll-y"
        >
          <a-i-chat-drawer
            v-if="splitterKey === 'AIChatDrawer'"
            :project-name="projectName"
            :diagram-path="diagramPath"
            :plugin-name="pluginName"
          />
          <component-detail-panel
            v-if="plugin && splitterKey === 'ComponentDetailPanel'"
            :id="componentId"
            :plugin="plugin"
            style="flex-grow: 1; overflow-y: auto;"
          />
        </div>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup>
import ProjectDetailsList from 'components/list/ProjectDetailsList.vue';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import ModelizerDrawTab from 'components/tab/ModelizerDrawTab.vue';
import AIChatDrawer from 'components/drawer/AIChatDrawer.vue';
import ComponentDetailPanel from 'components/drawer/ComponentDetailPanel.vue';
import { useRoute, useRouter } from 'vue-router';
import {
  addNewTemplateComponent,
  getPluginByName,
  initComponents,
  renderConfiguration,
  renderModel,
} from 'src/composables/PluginManager';
import LogEvent from 'src/composables/events/LogEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';
import PluginEvent from 'src/composables/events/PluginEvent';
import { useI18n } from 'vue-i18n';
import DialogEvent from 'src/composables/events/DialogEvent';
import { ComponentLink } from '@ditrit/leto-modelizer-plugin-core';
import FileEvent from 'src/composables/events/FileEvent';
import { Notify } from 'quasar';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const query = computed(() => route.query);
const projectName = computed(() => route.params.projectName);
const diagramPath = computed(() => query.value.path);
const pluginName = computed(() => query.value.plugin);
const HAS_BACKEND = computed(() => process.env.HAS_BACKEND);
const splitter = ref(100);
const splitterKey = ref('');
const isVisible = ref(false);
const componentId = ref('');
const offset = ref(0);
const plugin = ref(null);

let pluginDefaultSubscription;
let pluginRequestSubscription;
let drawerEventSubscription;
let aiDrawerNextState = 'open';

/**
 * Store offset from page and return appropriate style.
 * @param {number} value - Offset value.
 * @returns {object} Calculated height in css style.
 */
function getStyle(value) {
  offset.value = value;

  return {
    'min-height': `calc(100vh - ${value}px)`,
    'max-height': `calc(100vh - ${value}px)`,
  };
}

/**
 * Update plugin, draw components and update component templates array.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function initView() {
  if (!plugin.value) {
    return Promise.resolve();
  }

  return initComponents(
    route.params.projectName,
    plugin.value,
    query.value.path,
  ).then((logs) => {
    LogEvent.FileLogEvent.next(logs.map((log) => ({
      ...log,
      componentName: log.componentId ? plugin.value.data.getComponentById(log.componentId).externalId : '',
    })));
    plugin.value.initDrawer('view-port', false);
    plugin.value.arrangeComponentsPosition(null, true);
    plugin.value.draw();
  });
}

/**
 * On 'Drawer' event type, call renderConfiguration if action is 'move',
 * otherwise call renderModel.
 * @param {object} eventManager - Object containing event and plugin.
 * @param {object} eventManager.event - The triggered event.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onDefaultEvent({ event }) {
  const renderModelActions = ['update', 'delete', 'add'];
  const renderConfigurationActions = ['move', 'resize'];

  if (event.type === 'Drawer') {
    if (renderConfigurationActions.includes(event.action)) {
      await renderConfiguration(
        projectName.value,
        query.value.path,
        plugin.value,
      );
    } else if (renderModelActions.includes(event.action)) {
      await renderModel(
        projectName.value,
        query.value.path,
        plugin.value,
      );
    } else if (event.action === 'openMenu') {
      DialogEvent.next({
        type: 'open',
        key: 'ComponentMenu',
        event,
        pluginName: query.value.plugin,
      });
    }
  }
}

/**
 * On request event from ComponentMenuDialog.
 * @param {object} event - The triggered event.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onRequestEvent(event) {
  let needRender = false;
  if (event.type === 'fitToContent') {
    plugin.value.resize(event.id);
    plugin.value.draw();
  } else if (event.type === 'arrangeContent') {
    plugin.value.arrangeComponentsPosition(event.id, false);
    plugin.value.draw();
  } else if (event.type === 'delete') {
    needRender = true;
    plugin.value.data.removeComponentById(event.id);
    plugin.value.draw();
    DrawerEvent.next({
      type: 'close',
      key: 'ComponentDetailPanel',
    });
  } else if (event.type === 'linkToDefinition') {
    needRender = true;
    const componentPath = query.value.path
      ? `${projectName.value}/${query.value.path}`
      : projectName.value;
    const id = plugin.value.addComponent(
      null,
      event.data.componentDefinition,
      componentPath,
    );
    const component = plugin.value.data.getComponentById(event.id);

    component.setLinkAttribute(new ComponentLink({
      source: event.id,
      target: id,
      definition: event.data.linkDefinition,
    }));

    plugin.value.arrangeComponentsPosition(null, true);
    plugin.value.draw();
  } else if (event.type === 'linkToComponent') {
    needRender = true;
    const component = plugin.value.data.getComponentById(event.id);

    component.setLinkAttribute(new ComponentLink({
      source: event.id,
      target: event.data.target,
      definition: event.data.linkDefinition,
    }));

    plugin.value.draw();
  } else if (event.type === 'addComponentToContainer') {
    needRender = true;
    const componentPath = query.value.path
      ? `${projectName.value}/${query.value.path}`
      : projectName.value;
    plugin.value.addComponent(
      event.id,
      event.data.definition,
      componentPath,
    );

    plugin.value.arrangeComponentsPosition(event.id, true);
    plugin.value.draw();
  } else if (event.type === 'edit') {
    DrawerEvent.next({
      type: 'open',
      key: 'ComponentDetailPanel',
      id: event.id,
    });
  } else if (event.type === 'select') {
    const parent = plugin.value.data.getComponentById(event.ids[0]);
    plugin.value.data.scene.selection = event.ids;
    plugin.value.data.scene.selectionRef = parent.id;
    plugin.value.draw();
  } else if (event.type === 'openFile') {
    await router.push({
      name: 'Text',
      params: {
        projectName: projectName.value,
      },
      query: query.value,
    });
    FileEvent.SelectFileTabEvent.next(event.path);
  }

  if (needRender) {
    await onDefaultEvent({
      event: {
        type: 'Drawer',
        action: 'update',
      },
    });
  }
}

/**
 * Export diagram as svg.
 */
function exportSvg() {
  const content = plugin.value.exportSvg('view-port');
  const blob = new Blob([content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'diagram.svg';

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * Open Drawer and manage reserved height for footer.
 * @param {object} event - The triggered event.
 * @param {string} event.key - The key of event.
 * @param {string} event.type - The type of event, can be 'open' or 'close'.
 * @param {string} event.id - Id of component.
 */
function onDrawerEvent({ key, type, id }) {
  if (key !== 'ComponentDetailPanel' && key !== 'AIChatDrawer') {
    return;
  }

  if (key === 'AIChatDrawer') {
    aiDrawerNextState = type === 'close' ? 'open' : 'close';
  }
  componentId.value = id || null;
  splitterKey.value = key;
  isVisible.value = type === 'open';
  splitter.value = type === 'open' ? 60 : 100;
}

/**
 * Instantiate from a dragged component definition or template.
 * @param {DragEvent} event - The drag event.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function dropHandler(event) {
  const dropData = JSON.parse(event.dataTransfer.getData('text/plain'));

  const componentPath = query.value.path
    ? `${projectName.value}/${query.value.path}`
    : projectName.value;

  if (!dropData.definition.isTemplate) {
    plugin.value.addComponent(
      null,
      dropData.definition,
      componentPath,
      event,
    );
    plugin.value.draw();
  } else {
    await addNewTemplateComponent(
      projectName.value,
      plugin.value,
      componentPath,
      dropData.definition,
    )
      .then(() => {
        plugin.value.arrangeComponentsPosition(null, true);
        plugin.value.draw();
      })
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('errors.templates.getData'),
          html: true,
        });
      });
  }
  await renderModel(
    projectName.value,
    query.value.path,
    plugin.value,
  );
}

/**
 * Rearrange components and then redraw the whole view.
 */
async function arrangeComponentsPosition() {
  plugin.value.arrangeComponentsPosition(null, false);
  plugin.value.draw();

  await renderConfiguration(
    projectName.value,
    query.value.path,
    plugin.value,
  );
}

/**
 * Open AI drawer.
 */
function askAI() {
  DrawerEvent.next({
    type: 'close',
    key: 'ComponentDetailPanel',
  });
  DrawerEvent.next({
    type: aiDrawerNextState,
    key: 'AIChatDrawer',
  });
}

onMounted(() => {
  plugin.value = getPluginByName(query.value.plugin);
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe(onDefaultEvent);
  pluginRequestSubscription = PluginEvent.RequestEvent.subscribe(onRequestEvent);
  drawerEventSubscription = DrawerEvent.subscribe(onDrawerEvent);
  initView();
});

onUnmounted(() => {
  pluginDefaultSubscription.unsubscribe();
  pluginRequestSubscription.unsubscribe();
  drawerEventSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.sticky-actions {
  position: absolute;
  bottom: 16px;
  right: 16px;
}
.components-details-menu {
  min-width: 350px;
  width: 350px;
  max-width: 350px;
}
</style>

<style lang="scss">
.left-drawer-tab .q-tab__label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

div#view-port, div#view-port svg.scene {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  flex: 1;
  height: 100%;
  width: 100%;
}

.splitter-invisible .separator-class div {
  left: 0 !important;
  right: 0 !important;
}
</style>
