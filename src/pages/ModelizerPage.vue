<template>
  <q-layout
    class="modelizer-page column"
  >
    <modelizer-navigation-bar
      :project-name="projectName"
      :view-type="viewType"
    />
    <q-page-container>
      <q-page
        class="modelizer-page column"
        data-cy="modelizer-page"
      >
        <modelizer-models-view
          v-show="viewType === 'models'"
          :project-name="projectName"
        />
        <modelizer-model-view
          v-show="viewType === 'model'"
          :project-name="projectName"
        />
        <modelizer-text-view
          v-show="viewType === 'text'"
          :project-name="projectName"
        />
        <git-authentication-dialog :project-name="projectName" />
        <git-add-remote-dialog :project-name="projectName" />
        <git-new-branch-dialog :project-name="projectName" />
        <git-update-dialog :project-name="projectName" />
        <create-file-dialog :project-name="projectName" />
        <delete-file-dialog :project-name="projectName" />
        <git-status-dialog :project-name="projectName" />
        <git-push-dialog :project-name="projectName" />
        <git-commit-dialog :project-name="projectName" />
        <git-log-dialog :project-name="projectName" />
        <create-model-dialog :project-name="projectName" />
        <delete-model-dialog :project-name="projectName" />
        <rename-model-dialog :project-name="projectName" />
        <import-model-template-dialog :project-name="projectName" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ModelizerNavigationBar from 'src/components/ModelizerNavigationBar';
import ModelizerModelView from 'src/components/ModelizerModelView';
import ModelizerModelsView from 'src/components/ModelizerModelsView';
import ModelizerTextView from 'src/components/ModelizerTextView';
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
import ImportModelTemplateDialog from 'components/dialog/ImportModelTemplateDialog';

const route = useRoute();
const viewType = computed(() => route.params.viewType);
const projectName = computed(() => route.params.projectName);
</script>

<style scoped>
.q-layout.modelizer-page>.q-page-container {
  padding-top: 0 !important;
}
</style>
