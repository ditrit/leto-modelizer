<template>
  <q-page class="bg-grey-3">
    <div
      id="root"
      data-cy="draw-container"
      @dragover.prevent
      @drop.prevent="dropHandler"
    >
      <component-drop-overlay />
    </div>

    <q-page-sticky :offset="[20, 20]">
      <q-btn-group>
        <q-btn
          icon="fa-solid fa-sitemap"
          :label="$t('page.diagrams.actions.rearrange')"
          stack
          no-caps
          color="white"
          text-color="black"
          data-cy="rearrange-button"
          @click="arrangeComponentsPosition()"
        />
      </q-btn-group>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import ComponentDropOverlay from 'components/drawer/ComponentDropOverlay.vue';
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
import { useRoute } from 'vue-router';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import DialogEvent from 'src/composables/events/DialogEvent';
import { ComponentLink } from 'leto-modelizer-plugin-core';
import DrawerEvent from 'src/composables/events/DrawerEvent';

const { t } = useI18n();
const route = useRoute();

const projectName = computed(() => route.params.projectName);
const query = computed(() => route.query);

const data = reactive({
  plugin: null,
});
const templates = ref([]);

let pluginDefaultSubscription;
let pluginRequestSubscription;

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
      data.plugin.initDrawer('root', false);
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

onMounted(async () => {
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe((event) => {
    onDefaultEvent(event);
  });
  pluginRequestSubscription = PluginEvent.RequestEvent.subscribe((event) => {
    onRequestEvent(event);
  });
  await initView();
});

onUnmounted(() => {
  pluginDefaultSubscription.unsubscribe();
  pluginRequestSubscription.unsubscribe();
});
</script>

<style scoped>
#root {
  height: calc(100vh - 76px);
  width: 100%;
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
}
#viewport {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
