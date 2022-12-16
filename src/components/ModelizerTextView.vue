<template>
  <div
    class="modelizer-text-view row"
    data-cy="modelizer-text-view"
  >
    <div class="col-md-2 bg-grey-2 file-explorer-container">
      <git-branch-card/>
      <q-checkbox
        v-model="showParsableFiles"
        class="q-ml-lg"
        left-label
        :label="$t('page.modelizer.fileExplorer.filterParsableFiles')"
      />
      <file-explorer
        class="q-px-md q-py-sm overflow-auto"
        :nodes="nodes"
        :project-name="projectName"
        :show-parsable-files="showParsableFiles"
      />
    </div>

    <q-separator vertical />

    <file-tabs
      :files="fileTabArray"
      v-model="activeFileTab"
      @update:close-file="deleteFileTab"
    >
      <template v-slot="{ file }">
        <monaco-editor
          :fileInput="file"
          :project-name="projectName"
        />
      </template>
    </file-tabs>
  </div>
</template>

<script setup>
import { getTree } from 'src/composables/FileExplorer';
import MonacoEditor from 'components/editor/MonacoEditor.vue';
import FileExplorer from 'components/FileExplorer.vue';
import GitBranchCard from 'components/card/GitBranchCard';
import FileTabs from 'components/tab/FileTabs.vue';
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import {
  getProjectFiles,
  readProjectFile,
  writeProjectFile,
  getStatus,
} from 'src/composables/Project';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getPlugins } from 'src/composables/PluginManager';
import { FileInput, FileInformation } from 'leto-modelizer-plugin-core';
import FileStatus from 'src/models/git/FileStatus';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const fileTabArray = ref([]);
const activeFileTab = ref({ isSelected: false, id: '' });
const nodes = ref([]);
const selectedNode = ref({});
const localFileInformations = ref([]);
const showParsableFiles = ref(false);

let globalSaveFilesEventSubscription;
let checkoutSubscription;
let pluginRenderSubscription;
let pullSubscription;

/**
 * Update active file tab by setting its id equal to the last element of fileTabArray,
 * otherwise null if fileTabArray is empty.
 */
function setLastFileActive() {
  if (fileTabArray.value.length) {
    activeFileTab.value = {
      isSelected: true,
      id: fileTabArray.value[fileTabArray.value.length - 1].id,
    };
  } else {
    activeFileTab.value = { isSelected: false, id: '' };
  }

  FileEvent.SelectFileEvent.next(activeFileTab.value);
}

/**
 * Close file by removing it from fileTabArray array using its id.
 * If the closed file was the current active file tab, update activeFileTab.
 * @param {String} fileId - Id of closed file.
 */
function deleteFileTab(fileId) {
  fileTabArray.value = fileTabArray.value.filter(({ id }) => id !== fileId);

  if (fileId === activeFileTab.value.id) {
    setLastFileActive();
  }
}

/**
 * Update project nodes and fileTabArray.
 * If the previous active file's id is not contained in fileTabArray, update activeFileTab.
 * @param {FileInformation[]} fileInformations - Array of files.
 */
function updateFileExplorer(fileInformations) {
  localFileInformations.value = fileInformations;
  const projectFilesIds = fileInformations.map((file) => file.path);
  nodes.value = getTree(props.projectName, fileInformations);
  fileTabArray.value = fileTabArray.value.filter(({ id }) => projectFilesIds.includes(id));

  fileTabArray.value.forEach((file) => {
    readProjectFile(props.projectName, { path: file.id })
      .then(({ content }) => {
        file.content = content;
      });
  });

  const isActiveFileInFiles = fileTabArray.value
    .find(({ id }) => id === activeFileTab.value.id);

  if (!isActiveFileInFiles) {
    setLastFileActive();
  }
}

/**
 * Get projects files and their status, then call function to make the update.
 */
function updateProjectFiles() {
  return Promise.allSettled([
    getProjectFiles(props.projectName).then((fileInformations) => {
      updateFileExplorer(fileInformations);
      return fileInformations;
    }),
    getStatus(props.projectName),
  ]).then((allResults) => {
    const filesStatus = allResults[1].value;
    const fileInformations = allResults[0].value.map((file) => {
      const statusResult = filesStatus.find(({ path }) => file.path === path);

      if (statusResult) {
        return statusResult;
      }
      return new FileStatus({ path: file.path });
    });

    updateFileExplorer(fileInformations);
  });
}

/**
 * Render components and update files accordingly.
 */
async function renderPlugins() {
  const plugins = getPlugins();
  const requests = [];
  const config = new FileInput({
    path: 'leto-modelizer.config.json',
    content: '{}',
  });

  plugins.forEach((plugin) => {
    plugin.render(config).forEach((file) => requests.push(
      writeProjectFile(props.projectName, file).then(() => {
        FileEvent.CreateFileEvent.next({
          name: file.path.substring(file.path.lastIndexOf('/') + 1),
          isFolder: false,
          path: file.path,
        });
      }),
    ));
  });

  Promise.allSettled([
    ...requests,
    writeProjectFile(props.projectName, config),
  ]).then(() => PluginEvent.DrawEvent.next());
}

watch(activeFileTab, () => {
  FileEvent.SelectFileEvent.next(activeFileTab.value);
});

onMounted(() => {
  updateProjectFiles();
  globalSaveFilesEventSubscription = FileEvent.GlobalSaveFilesEvent.subscribe(updateProjectFiles);
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(updateProjectFiles);
  pluginRenderSubscription = PluginEvent.RenderEvent.subscribe(renderPlugins);
  pullSubscription = GitEvent.PullEvent.subscribe(updateProjectFiles);
});

onUnmounted(() => {
  globalSaveFilesEventSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
  pluginRenderSubscription.unsubscribe();
  pullSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.modelizer-text-view {
 // set min-height to full height excluding header height
 // 74px = height of header
  min-height: calc(100vh - 74px)
}
.file-explorer-container {
  min-width: 200px;
}
</style>
