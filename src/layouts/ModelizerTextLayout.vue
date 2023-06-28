<template>
  <q-layout view="hHh LpR fFf">
    <navigation-bar
      :project-name="projectName"
    />
    <modelizer-text-left-drawer />
    <q-page-container>
      <modelizer-text-page />
    </q-page-container>

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
  </q-layout>
</template>

<script setup>
import NavigationBar from 'src/components/NavigationBar.vue';
import ModelizerTextLeftDrawer from 'src/components/drawer/ModelizerTextLeftDrawer.vue';
import ModelizerTextPage from 'src/pages/ModelizerTextPage.vue';
import GitAuthenticationDialog from 'src/components/dialog/GitAuthenticationDialog';
import GitAddRemoteDialog from 'src/components/dialog/GitAddRemoteDialog';
import GitNewBranchDialog from 'src/components/dialog/GitNewBranchDialog';
import GitUpdateDialog from 'src/components/dialog/GitUpdateDialog';
import CreateFileDialog from 'src/components/dialog/CreateFileDialog';
import DeleteFileDialog from 'src/components/dialog/DeleteFileDialog';
import GitStatusDialog from 'src/components/dialog/GitStatusDialog';
import GitPushDialog from 'src/components/dialog/GitPushDialog';
import GitCommitDialog from 'src/components/dialog/GitCommitDialog';
import GitLogDialog from 'src/components/dialog/GitLogDialog';
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FileEvent from 'src/composables/events/FileEvent';
import { getAllModels } from 'src/composables/Project';

const route = useRoute();
const router = useRouter();

const query = computed(() => route.query);
const projectName = computed(() => route.params.projectName);

let selectFileTabSubscription;

/**
 * Get model corresponding to the selected file tab.
 * @param {String} selectedFileTabPath - Path of the selected file tab.
 * @return {Promise<Object>} Promise with the model or undefined on success otherwise an error.
 */
async function getModel(selectedFileTabPath) {
  if (!selectedFileTabPath) {
    return undefined;
  }

  const models = await getAllModels(projectName.value);
  const defaultFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/`
    : '';

  return models.find(
    ({ name, plugin }) => selectedFileTabPath.startsWith(`${defaultFolder}${plugin}/${name}/`),
  );
}

/**
 * Update the path of the query if necessary.
 * @param {String} event - Path of the selected file tab.
 * @return {Promise<Object>} Promise with nothing on success otherwise an error.
 */
async function onSelectFileTab(event) {
  if (event && !event.startsWith(`${query.value.path}/`)) {
    const model = await getModel(event);
    const modelPath = model ? `${model.plugin}/${model.name}` : query.value.path;

    await router.push({
      name: 'Text',
      params: {
        projectName: projectName.value,
      },
      query: {
        path: modelPath,
      },
    });
  }
}

onMounted(() => {
  selectFileTabSubscription = FileEvent.SelectFileTabEvent.subscribe(
    (e) => { onSelectFileTab(e); },
  );
});

onUnmounted(() => {
  selectFileTabSubscription.unsubscribe();
});
</script>

<style scoped>
.q-page-container {
  padding-top: 0 !important;
}
</style>
