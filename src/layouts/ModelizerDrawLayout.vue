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
    <component-detail-panel
      v-if="data.plugin"
      :plugin="data.plugin"
    />
    <q-page-container>
      <modelizer-draw-page />
    </q-page-container>

    <console-footer is-diagram-error />

    <git-authentication-dialog :project-name="projectName" />
    <git-add-remote-dialog :project-name="projectName" />
    <component-menu-dialog dialog-key="ComponentMenu" />
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

const { t } = useI18n();
const route = useRoute();

const projectName = computed(() => route.params.projectName);
const query = computed(() => route.query);

const data = reactive({
  plugin: null,
});
const templates = ref([]);

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

onMounted(() => {
  initView();
});
</script>
