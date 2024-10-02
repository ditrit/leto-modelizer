<template>
  <q-layout view="hHh LpR fFf">
    <navigation-bar
      :project-name="projectName"
    />
    <modelizer-text-left-drawer />
    <q-page-container>
      <q-splitter
        v-model="splitter"
        :limits="[30, 100]"
        separator-class="separator-class"
        :style="{ height: `calc(100vh - ${reservedHeight + 70}px)` }"
      >
        <template #before>
          <modelizer-text-page />
        </template>
      </q-splitter>
    </q-page-container>

    <console-footer />

    <create-file-dialog :project-name="projectName" />
    <rename-file-dialog :project-name="projectName" />
    <delete-file-dialog :project-name="projectName" />
    <git-authentication-dialog :project-name="projectName" />
    <git-add-remote-dialog :project-name="projectName" />
    <git-new-branch-dialog :project-name="projectName" />
    <git-update-dialog :project-name="projectName" />
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
import CreateFileDialog from 'src/components/dialog/CreateFileDialog.vue';
import RenameFileDialog from 'src/components/dialog/RenameFileDialog.vue';
import DeleteFileDialog from 'src/components/dialog/DeleteFileDialog.vue';
import GitAuthenticationDialog from 'src/components/dialog/GitAuthenticationDialog.vue';
import GitAddRemoteDialog from 'src/components/dialog/GitAddRemoteDialog.vue';
import GitNewBranchDialog from 'src/components/dialog/GitNewBranchDialog.vue';
import GitUpdateDialog from 'src/components/dialog/GitUpdateDialog.vue';
import GitStatusDialog from 'src/components/dialog/GitStatusDialog.vue';
import GitPushDialog from 'src/components/dialog/GitPushDialog.vue';
import GitCommitDialog from 'src/components/dialog/GitCommitDialog.vue';
import GitLogDialog from 'src/components/dialog/GitLogDialog.vue';
import {
  computed,
  onMounted,
  onUnmounted, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FileEvent from 'src/composables/events/FileEvent';
import { getPluginByName, getPlugins } from 'src/composables/PluginManager';
import DrawerEvent from 'src/composables/events/DrawerEvent';

const route = useRoute();
const router = useRouter();

const query = computed(() => route.query);
const projectName = computed(() => route.params.projectName);
const splitter = ref(100);
const reservedHeight = ref(37);

let selectFileTabSubscription;
let drawerEventSubscription;

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
    const fullModelPath = plugin?.getModels([{ path: event }]).find(() => true);
    const modelPath = fullModelPath === route.params.projectName ? '' : fullModelPath?.split('/').slice(1).join('/');

    await router.push({
      name: 'Text',
      params: {
        projectName: projectName.value,
      },
      query: {
        plugin: plugin?.data.name,
        path: modelPath ?? query.value.path,
      },
    });
  }
}

/**
 * Manage reserved height for footer.
 * @param {object} event - The triggered event.
 * @param {string} event.key - The key of event.
 * @param {string} event.type - The type of event, can be 'open' or 'close'.
 */
function onDrawerEvent({ key, type }) {
  if (key === 'ConsoleFooter') {
    reservedHeight.value = type === 'open' ? 413 : 37;
  }
}

onMounted(() => {
  selectFileTabSubscription = FileEvent.SelectFileTabEvent.subscribe(
    (e) => { onSelectFileTab(e); },
  );
  drawerEventSubscription = DrawerEvent.subscribe(onDrawerEvent);
});

onUnmounted(() => {
  selectFileTabSubscription.unsubscribe();
  drawerEventSubscription.unsubscribe();
});
</script>
