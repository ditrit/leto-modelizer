<template>
  <q-layout view="hHh LpR fFf">
    <navigation-bar
      :project-name="projectName"
    />

    <modelizer-draw-left-drawer
      v-if="data.plugin"
      :plugin="data.plugin"
      :templates="templates"
      :project-name="projectName"
    />

    <q-page-container>
      <q-splitter
        v-model="splitter"
        :limits="[50, 100]"
        separator-class="separator-class"
        :class="isVisible ? '' : 'splitter-invisible'"
        :style="{ height: `calc(100vh - ${reservedHeight + 70}px)` }"
      >
        <template #before>
          <modelizer-draw-page />
        </template>
        <template #after>
          <div
            v-if="isVisible"
            style="display: flex; height: 100%; max-height: 100%; overflow-y: auto;"
          >
            <a-i-chat-drawer
              v-if="splitterKey === 'AIChatDrawer'"
              :project-name="projectName"
              :diagram-path="diagramPath"
              :plugin-name="pluginName"
            />
            <component-detail-panel
              v-if="data.plugin && splitterKey === 'ComponentDetailPanel'"
              :id="componentId"
              :plugin="data.plugin"
              style="flex-grow: 1; overflow-y: auto;"
            />
          </div>
        </template>
      </q-splitter>
    </q-page-container>

    <console-footer editor-type="diagram" />

    <git-authentication-dialog :project-name="projectName" />
    <git-add-remote-dialog :project-name="projectName" />
    <component-menu-dialog dialog-key="ComponentMenu" />
    <delete-a-i-conversation-dialog />
  </q-layout>
</template>

<script setup>
import NavigationBar from 'src/components/NavigationBar.vue';
import ModelizerDrawLeftDrawer from 'src/components/drawer/ModelizerDrawLeftDrawer.vue';
import ComponentDetailPanel from 'src/components/drawer/ComponentDetailPanel.vue';
import ModelizerDrawPage from 'src/pages/ModelizerDrawPage.vue';
import { getPluginByName, initComponents } from 'src/composables/PluginManager';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { Notify } from 'quasar';
import GitAuthenticationDialog from 'components/dialog/GitAuthenticationDialog.vue';
import GitAddRemoteDialog from 'components/dialog/GitAddRemoteDialog.vue';
import ComponentMenuDialog from 'components/dialog/ComponentMenuDialog.vue';
import ConsoleFooter from 'components/drawer/ConsoleFooter.vue';
import LogEvent from 'src/composables/events/LogEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';
import AIChatDrawer from 'components/drawer/AIChatDrawer.vue';
import DeleteAIConversationDialog from 'components/dialog/DeleteAIConversationDialog.vue';

const { t } = useI18n();
const route = useRoute();

const query = computed(() => route.query);
const projectName = computed(() => route.params.projectName);
const diagramPath = computed(() => query.value.path);
const pluginName = computed(() => query.value.plugin);
const splitter = ref(100);
const splitterKey = ref('');
const isVisible = ref(false);
const templates = ref([]);
const componentId = ref('');
const reservedHeight = ref(37);

const data = reactive({
  plugin: null,
});

let drawerEventSubscription;

/**
 * Update plugin, draw components and update component templates array.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function initView() {
  data.plugin = getPluginByName(query.value.plugin);

  if (!data.plugin) {
    return;
  }

  await Promise.allSettled([
    initComponents(
      route.params.projectName,
      data.plugin,
      query.value.path,
    ).then((logs) => {
      LogEvent.FileLogEvent.next(logs.map((log) => ({
        ...log,
        componentId: log.componentId ? data.plugin.data.getComponentById(log.componentId).externalId : '',
      })));
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
 * Open Drawer and manage reserved height for footer.
 * @param {object} event - The triggered event.
 * @param {string} event.key - The key of event.
 * @param {string} event.type - The type of event, can be 'open' or 'close'.
 * @param {string} event.id - Id of component.
 */
function onDrawerEvent({ key, type, id }) {
  if (key === 'ConsoleFooter') {
    reservedHeight.value = type === 'open' ? 413 : 37;
    return;
  }
  componentId.value = id || null;
  splitterKey.value = key;
  isVisible.value = type === 'open';
  splitter.value = type === 'open' ? 75 : 100;
}

onMounted(() => {
  initView();
  drawerEventSubscription = DrawerEvent.subscribe(onDrawerEvent);
});

onUnmounted(() => {
  drawerEventSubscription.unsubscribe();
});
</script>

<style>
.splitter-invisible .separator-class div {
  left: 0px!important;
  right: 0px!important;
}
</style>
