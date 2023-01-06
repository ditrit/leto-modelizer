<template>
  <!-- <q-layout
    view="hHh LpR lfr"
    class="modelizer-page column"
    data-cy="modelizer-page"
  > -->
    <modelizer-navigation-bar
      :projectName="projectName"
      :viewType="viewType"
      @changeView="changeView"
    />

    <!-- <q-page-container>
      <q-page
        class="modelizer-page column"
        data-cy="modelizer-page"
      >
        <modelizer-model-view
          v-show="viewType === 'model'"
          :project-name="projectName"
        />
        <modelizer-text-view
          v-show="viewType === 'text'"
          :project-name="projectName"
        />
      </q-page>
    </q-page-container> -->

    <component-definitions-drawer
      v-show="viewType === 'model'"
      :plugins="data.plugins"
    />
    <modelizer-model-view
      v-show="viewType === 'model'"
      :project-name="projectName"
      :plugins="data.plugins"
    />
    <component-detail-panel
      v-show="viewType === 'model'"
    />

    <modelizer-text-view
      v-show="viewType === 'text'"
      :project-name="projectName"
    />
    <text-view-left-drawer
      v-show="viewType === 'text'"
      :project-name="projectName"
    />

    <git-configuration-dialog :project-name="projectName"/>
    <git-new-branch-dialog :project-name="projectName"/>
    <git-update-dialog :project-name="projectName"/>
    <create-file-dialog :project-name="projectName"/>
    <delete-file-dialog :project-name="projectName"/>
    <git-status-dialog :project-name="projectName"/>
    <git-push-dialog :project-name="projectName"/>
    <git-commit-dialog :project-name="projectName"/>
    <git-log-dialog :project-name="projectName"/>
  <!-- </q-layout> -->
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  computed,
  reactive,
} from 'vue';
import {
  useRouter,
  useRoute,
} from 'vue-router';
import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar';
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer';
import ComponentDetailPanel from 'components/drawer/ComponentDetailPanel';
import TextViewLeftDrawer from 'components/drawer/TextViewLeftDrawer';
import ModelizerModelView from 'src/components/ModelizerModelView';
import ModelizerTextView from 'src/components/ModelizerTextView';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import GitConfigurationDialog from 'components/dialog/GitConfigurationDialog';
import GitNewBranchDialog from 'components/dialog/GitNewBranchDialog';
import GitUpdateDialog from 'components/dialog/GitUpdateDialog';
import CreateFileDialog from 'components/dialog/CreateFileDialog';
import DeleteFileDialog from 'components/dialog/DeleteFileDialog';
import GitStatusDialog from 'components/dialog/GitStatusDialog';
import GitPushDialog from 'components/dialog/GitPushDialog';
import GitCommitDialog from 'components/dialog/GitCommitDialog';
import GitLogDialog from 'components/dialog/GitLogDialog';
import {
  getPlugins,
} from 'src/composables/PluginManager';

const route = useRoute();
const router = useRouter();
const viewType = computed(() => route.params.viewType);
const projectName = computed(() => route.params.projectName);
let viewSwitchSubscription;

const data = reactive({
  plugins: [],
});

/**
 * Update the route with the new view type.
 *
 * @param {string} newViewType
 */
function changeView(newViewType) {
  if (newViewType !== viewType.value) {
    router.push({
      name: 'modelizer',
      params: {
        viewType: newViewType,
        projectName: projectName.value,
      },
    });
  }
}

/**
 * Update plugins array
 */
function updatePlugins() {
  data.plugins = getPlugins();
  // data.plugins.forEach((plugin) => drawComponents(plugin));
}

onMounted(() => {
  updatePlugins();
  viewSwitchSubscription = ViewSwitchEvent.subscribe(changeView);
});

onUnmounted(() => {
  viewSwitchSubscription.unsubscribe();
});
</script>

<style scoped>
/* .q-layout.modelizer-page>.q-page-container {
  padding-top: 0 !important;
} */
</style>
