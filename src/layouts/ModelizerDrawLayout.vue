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
    <git-authentication-dialog :project-name="projectName" />
    <git-add-remote-dialog :project-name="projectName" />
  </q-layout>
</template>

<script setup>
import NavigationBar from 'src/components/NavigationBar.vue';
import ModelizerDrawLeftDrawer from 'src/components/drawer/ModelizerDrawLeftDrawer.vue';
import ComponentDetailPanel from 'src/components/drawer/ComponentDetailPanel.vue';
import ModelizerDrawPage from 'src/pages/ModelizerDrawPage.vue';
import { getPluginByName, initComponents } from 'src/composables/PluginManager';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import PluginEvent from 'src/composables/events/PluginEvent';
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

const { t } = useI18n();
const route = useRoute();

const projectName = computed(() => route.params.projectName);
const query = computed(() => route.query);

const data = reactive({
  plugin: null,
});
const templates = ref([]);

let pluginInitSubscription;

/**
 * Update plugin, draw components and update component templates array.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function initView() {
  if (!query.value?.path) {
    return;
  }

  data.plugin = getPluginByName(query.value.plugin);

  if (!data.plugin) {
    return;
  }

  await Promise.allSettled([
    initComponents(
      route.params.projectName,
      data.plugin,
      query.value.path,
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

onMounted(() => {
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(() => {
    initView();
  });
  initView();
});

onUnmounted(() => {
  pluginInitSubscription.unsubscribe();
});
</script>

<style scoped>
.q-page-container {
  padding-top: 0 !important;
}
</style>
