<template>
  <q-layout
    class="modelizer-page column"
    data-cy="modelizer-page"
  >
    <modelizer-navigation-bar
      :projectName="projectName"
      :viewType="viewType"
      @changeView="changeView"
    />
    <q-page-container>
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
        <git-authentication-dialog :project-name="projectName"/>
        <git-add-remote-dialog :project-name="projectName"/>
        <git-new-branch-dialog :project-name="projectName"/>
        <git-update-dialog :project-name="projectName"/>
        <create-file-dialog :project-name="projectName"/>
        <delete-file-dialog :project-name="projectName"/>
        <git-status-dialog :project-name="projectName"/>
        <git-push-dialog :project-name="projectName"/>
        <git-commit-dialog :project-name="projectName"/>
        <git-log-dialog :project-name="projectName"/>
        <create-model-dialog :project-name="projectName"/>
        <delete-model-dialog :project-name="projectName"/>
        <rename-model-dialog :project-name="projectName"/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  computed,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar';
import ModelizerModelView from 'src/components/ModelizerModelView';
import ModelizerTextView from 'src/components/ModelizerTextView';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import GitAuthenticationDialog from 'components/dialog/GitAuthenticationDialog';
import GitAddRemoteDialog from 'components/dialog/GitAddRemoteDialog';
import GitNewBranchDialog from 'components/dialog/GitNewBranchDialog';
import GitUpdateDialog from 'components/dialog/GitUpdateDialog';
import CreateFileDialog from 'components/dialog/CreateFileDialog';
import DeleteFileDialog from 'components/dialog/DeleteFileDialog';
import GitStatusDialog from 'components/dialog/GitStatusDialog';
import GitPushDialog from 'components/dialog/GitPushDialog';
import GitCommitDialog from 'components/dialog/GitCommitDialog';
import GitLogDialog from 'components/dialog/GitLogDialog';
import CreateModelDialog from 'components/dialog/CreateModelDialog';
import DeleteModelDialog from 'components/dialog/DeleteModelDialog';
import RenameModelDialog from 'components/dialog/RenameModelDialog';

const route = useRoute();
const router = useRouter();
const viewType = computed(() => route.params.viewType);
const projectName = computed(() => route.params.projectName);
let viewSwitchSubscription;

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

onMounted(() => {
  viewSwitchSubscription = ViewSwitchEvent.subscribe(changeView);
});

onUnmounted(() => {
  viewSwitchSubscription.unsubscribe();
});
</script>

<style scoped>
.q-layout.modelizer-page>.q-page-container {
  padding-top: 0 !important;
}
</style>
