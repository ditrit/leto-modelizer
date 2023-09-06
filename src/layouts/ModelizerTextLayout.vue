<template>
  <q-layout view="hHh LpR fFf">
    <navigation-bar
      :project-name="projectName"
    />
    <modelizer-text-left-drawer />
    <q-page-container>
      <modelizer-text-page />
    </q-page-container>

    <console-footer :errors="parseErrors" />

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
import ConsoleFooter from 'src/components/drawer/ConsoleFooter.vue';
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
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FileEvent from 'src/composables/events/FileEvent';
import { getPluginByName, getPlugins } from 'src/composables/PluginManager';

const route = useRoute();
const router = useRouter();

const query = computed(() => route.query);
const projectName = computed(() => route.params.projectName);
const parseErrors = ref(getPluginByName(query.value.plugin).data.parseErrors);

let selectFileTabSubscription;

/**
 * Update the path of the query if necessary.
 * @param {string} event - Path of the selected file tab.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
async function onSelectFileTab(event) {
  const regex = new RegExp(`^${query.value.path}[^/]+$`);

  if (!regex.test(event)) {
    const plugin = getPlugins()
      .find((p) => p.isParsable({ path: event })) || getPluginByName(query.value.plugin);
    const modelPath = plugin?.getModels([{ path: event }]).find(() => true);

    await router.push({
      name: 'Text',
      params: {
        projectName: projectName.value,
      },
      query: {
        plugin: plugin?.data.name,
        path: modelPath !== undefined ? modelPath : query.value.path,
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
