<template>
  <q-page class="bg-grey-3 column">
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
  </q-page>
</template>

<script setup>
import {
  addNewTemplateComponent,
  getPluginByName,
  initComponents,
  renderConfiguration,
  renderModel,
} from 'src/composables/PluginManager';
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import DialogEvent from 'src/composables/events/DialogEvent';
import { ComponentLink } from '@ditrit/leto-modelizer-plugin-core';
import DrawerEvent from 'src/composables/events/DrawerEvent';
import FileEvent from 'src/composables/events/FileEvent';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const HAS_BACKEND = computed(() => process.env.HAS_BACKEND);
const projectName = computed(() => route.params.projectName);
const query = computed(() => route.query);

const data = reactive({
  plugin: null,
});
const templates = ref([]);

let pluginDefaultSubscription;
let pluginRequestSubscription;
let drawerEventSubscription;
let aiDrawerNextState = 'open';

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
        data.plugin,
      );
    } else if (renderModelActions.includes(event.action)) {
      await renderModel(
        projectName.value,
        query.value.path,
        data.plugin,
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
    data.plugin.resize(event.id);
    data.plugin.draw();
  } else if (event.type === 'arrangeContent') {
    data.plugin.arrangeComponentsPosition(event.id, false);
    data.plugin.draw();
  } else if (event.type === 'delete') {
    needRender = true;
    data.plugin.data.removeComponentById(event.id);
    data.plugin.draw();
    DrawerEvent.next({
      type: 'close',
      key: 'ComponentDetailPanel',
    });
  } else if (event.type === 'linkToDefinition') {
    needRender = true;
    const componentPath = query.value.path
      ? `${projectName.value}/${query.value.path}`
      : projectName.value;
    const id = data.plugin.addComponent(
      null,
      event.data.componentDefinition,
      componentPath,
    );
    const component = data.plugin.data.getComponentById(event.id);

    component.setLinkAttribute(new ComponentLink({
      source: event.id,
      target: id,
      definition: event.data.linkDefinition,
    }));

    data.plugin.arrangeComponentsPosition(null, true);
    data.plugin.draw();
  } else if (event.type === 'linkToComponent') {
    needRender = true;
    const component = data.plugin.data.getComponentById(event.id);

    component.setLinkAttribute(new ComponentLink({
      source: event.id,
      target: event.data.target,
      definition: event.data.linkDefinition,
    }));

    data.plugin.draw();
  } else if (event.type === 'addComponentToContainer') {
    needRender = true;
    const componentPath = query.value.path
      ? `${projectName.value}/${query.value.path}`
      : projectName.value;
    data.plugin.addComponent(
      event.id,
      event.data.definition,
      componentPath,
    );

    data.plugin.arrangeComponentsPosition(event.id, true);
    data.plugin.draw();
  } else if (event.type === 'edit') {
    DrawerEvent.next({
      type: 'open',
      key: 'ComponentDetailPanel',
      id: event.id,
    });
  } else if (event.type === 'select') {
    const parent = data.plugin.data.getComponentById(event.ids[0]);
    data.plugin.data.scene.selection = event.ids;
    data.plugin.data.scene.selectionRef = parent.id;
    data.plugin.draw();
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
  const content = data.plugin.exportSvg('view-port');
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
 * Update plugin, draw components and update component templates array.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function initView() {
  data.plugin = getPluginByName(query.value.plugin);

  if (!data.plugin) {
    return Promise.resolve();
  }

  return Promise.allSettled([
    initComponents(
      route.params.projectName,
      data.plugin,
      query.value.path,
    ).then(() => {
      data.plugin.initDrawer('view-port', false);
      data.plugin.arrangeComponentsPosition(null, true);
      data.plugin.draw();
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
 * Instantiate from a dragged component definition or template.
 * @param {DragEvent} event - The drag event.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function dropHandler(event) {
  const dropData = JSON.parse(event.dataTransfer.getData('text/plain'));

  const componentPath = query.value.path
    ? `${projectName.value}/${query.value.path}`
    : projectName.value;

  if (!dropData.isTemplate) {
    const componentDefinition = data.plugin.data.definitions.components
      .find(({ type }) => type === dropData.definitionType);

    data.plugin.addComponent(
      null,
      componentDefinition,
      componentPath,
      event,
    );
    data.plugin.draw();
  } else {
    const templateDefinition = templates.value.find(
      ({ key }) => key === dropData.definitionType,
    );

    await addNewTemplateComponent(
      projectName.value,
      data.plugin,
      componentPath,
      templateDefinition,
    )
      .then(() => {
        data.plugin.arrangeComponentsPosition(null, true);
        data.plugin.draw();
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
    data.plugin,
  );
}

/**
 * Rearrange components and then redraw the whole view.
 */
async function arrangeComponentsPosition() {
  data.plugin.arrangeComponentsPosition(null, false);
  data.plugin.draw();

  await renderConfiguration(
    projectName.value,
    query.value.path,
    data.plugin,
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

/**
 * Set the state of AI chat Drawer.
 * @param {object} event - The triggered event.
 * @param {string} event.key - The key of event.
 * @param {string} event.type - The type of event, can be 'open' or 'close'.
 */
function setAIDrawerNextState({ key, type }) {
  if (key === 'AIChatDrawer') {
    aiDrawerNextState = type === 'close' ? 'open' : 'close';
  }
}

onMounted(async () => {
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe(onDefaultEvent);
  pluginRequestSubscription = PluginEvent.RequestEvent.subscribe(onRequestEvent);
  drawerEventSubscription = DrawerEvent.subscribe(setAIDrawerNextState);
  await initView();
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
  bottom: 20px;
  right: 20px;
}
</style>

<style lang="scss">
div#view-port, div#view-port svg.scene {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  flex: 1;
  height: 100%;
  width: 100%;
}
</style>
