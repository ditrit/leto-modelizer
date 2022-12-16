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
        :fileInformations="localFileInformations"
        :project-name="projectName"
        :show-parsable-files="showParsableFiles"
      />
    </div>

    <q-separator vertical />
    <file-tabs
      :fileInformations="localFileInformations"
    >
      <template v-slot="{ file }">
        <monaco-editor
          :file="file"
          :project-name="projectName"
        />
      </template>
    </file-tabs>
  </div>
</template>

<script setup>
import MonacoEditor from 'components/editor/MonacoEditor.vue';
import FileExplorer from 'components/FileExplorer.vue';
import GitBranchCard from 'components/card/GitBranchCard';
import FileTabs from 'components/tab/FileTabs.vue';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import {
  getProjectFiles,
  writeProjectFile,
  getStatus,
} from 'src/composables/Project';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import { getPlugins } from 'src/composables/PluginManager';
import { FileInput, FileInformation } from 'leto-modelizer-plugin-core';
import FileStatus from 'src/models/git/FileStatus';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const localFileInformations = ref([]);
const showParsableFiles = ref(false);

let globalSaveFilesEventSubscription;
let updateEditorContentSubscription;
let createFileSubscription;
let deleteFileSubscription;
let addRemoteSubscription;
let checkoutSubscription;
let pullSubscription;
let pushSubscription;
let addFileSubscription;
let commitFilesSubscription;
let viewSwitchSubscription;

/**
 * Get projects files and their status, then call function to make the update.
 */
function updateProjectFiles() {
  return Promise.allSettled([
    getProjectFiles(props.projectName).then((fileInformations) => {
      localFileInformations.value = fileInformations;
      return fileInformations;
    }),
    getStatus(props.projectName),
  ]).then((allResults) => {
    const filesStatus = allResults[1].value;
    localFileInformations.value = allResults[0].value.map(
      (file) => filesStatus.find(({ path }) => file.path === path)
        || new FileStatus({ path: file.path }),
    );
  });
}

function onUpdateEditorContent(filePath) {
  getStatus(props.projectName, [filePath], (path) => path === filePath)
    .then(([fileStatus]) => {
      const index = localFileInformations.value
        .findIndex((fileInformation) => fileInformation.path === filePath);

      localFileInformations.value[index] = fileStatus;
    });
}

function onPush() {
  getStatus(props.projectName)
    .then((allStatus) => {
      localFileInformations.value = localFileInformations.value.map(
        (file) => allStatus.find(({ path }) => file.path === path)
          || new FileStatus({ path: file.path }),
      );
    });
}

/**
 * Update nodes and fileTabArray when file content is updated.
 * @param {String} filePath - Path (id) of the updated file.
 */
async function onAddFile(filePath) {
  const filePathIndex = localFileInformations.value.findIndex(({ path }) => path === filePath);

  const [fileStatus] = await getStatus(
    props.projectName,
    [filePath],
    (f) => f === filePath,
  );

  localFileInformations.value[filePathIndex] = fileStatus;
}

async function onCommitFiles(stagedFiles) {
  const filePaths = stagedFiles.map(({ path }) => path);

  const fileStatus = await getStatus(
    props.projectName,
    filePaths,
    (f) => filePaths.includes(f),
  );

  localFileInformations.value = localFileInformations.value.map((fileInformation) => fileStatus
    .find(({ path }) => path === fileInformation.path) || fileInformation);
}

function onCreateFile({ name, isFolder, path }) {
  const parentNodeId = path.substring(0, path.lastIndexOf('/')) || props.projectName;

  if (isFolder) {
    localFileInformations.value.push(new FileInformation({ path: `${path}/__empty__` }));
    FileEvent.CreateFileNodeEvent.next({ parentNodeId, node: null, isFolder });
  } else {
    getStatus(props.projectName, [path], (filePath) => filePath === path)
      .then(([fileStatus]) => {
        localFileInformations.value.push(fileStatus);

        FileEvent.CreateFileNodeEvent.next({
          parentNodeId,
          node: { id: path, label: name },
          isFolder,
        });
      });
  }
}

function onDeleteFile(file) {
  const temp = localFileInformations.value
    .filter(({ path }) => (file.isFolder ? !path.startsWith(`${file.id}/`) : path !== file.id));

  const parentPath = file.id.slice(0, file.id.lastIndexOf('/') + 1);

  if (!temp.some(({ path }) => path.startsWith(parentPath))) {
    temp.push(new FileInformation({ path: `${file.id}/__empty__` }));
  }

  localFileInformations.value = temp;
}

/**
 * Render components and update files accordingly.
 */
// TODO replace/update
async function renderPlugins() {
  const plugins = getPlugins();
  const requests = [];
  const config = new FileInput({
    path: 'leto-modelizer.config.json',
    content: '{}',
  });

  plugins.forEach((plugin) => {
    plugin.render(config).forEach((file) => requests.push(
      writeProjectFile(props.projectName, file).then(() => file),
    ));
  });

  requests.push(writeProjectFile(props.projectName, config).then(() => config));

  return Promise.allSettled(requests)
    .then((allResults) => allResults
      .map((result) => result.value)
      .reduce((acc, file) => {
        if (localFileInformations.value.find(({ path }) => file.path === path)) {
          acc.updatedFiles.push(file);
        } else {
          acc.createdFiles.push(file);
        }
        return acc;
      }, { createdFiles: [], updatedFiles: [] }));
}

async function onSwitchView(newViewType) {
  if (newViewType !== 'text') {
    return;
  }

  const { createdFiles, updatedFiles } = await renderPlugins();
  await updateProjectFiles();

  createdFiles.forEach((file) => {
    const parentNodeId = file.path.substring(0, file.path.lastIndexOf('/')) || props.projectName;

    FileEvent.CreateFileNodeEvent.next({
      parentNodeId,
      node: { id: file.path, label: file.path.split('/').at(-1) },
      isFolder: false,
    });
  });

  if (updatedFiles.length >= 1) {
    FileEvent.UpdateFileContentEvent.next();
  }
}

onMounted(() => {
  updateProjectFiles();
  globalSaveFilesEventSubscription = FileEvent.GlobalSaveFilesEvent.subscribe(updateProjectFiles);
  createFileSubscription = FileEvent.CreateFileEvent.subscribe(onCreateFile);
  deleteFileSubscription = FileEvent.DeleteFileEvent.subscribe(onDeleteFile);
  updateEditorContentSubscription = FileEvent.UpdateEditorContentEvent
    .subscribe(onUpdateEditorContent);

  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(updateProjectFiles);
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(updateProjectFiles);
  pullSubscription = GitEvent.PullEvent.subscribe(updateProjectFiles);
  pushSubscription = GitEvent.PushEvent.subscribe(onPush);
  addFileSubscription = GitEvent.AddEvent.subscribe(onAddFile);
  commitFilesSubscription = GitEvent.CommitEvent.subscribe(onCommitFiles);

  viewSwitchSubscription = ViewSwitchEvent.subscribe(onSwitchView);
});

onUnmounted(() => {
  globalSaveFilesEventSubscription.unsubscribe();
  createFileSubscription.unsubscribe();
  deleteFileSubscription.unsubscribe();
  updateEditorContentSubscription.unsubscribe();

  addRemoteSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
  pullSubscription.unsubscribe();
  pushSubscription.unsubscribe();
  addFileSubscription.unsubscribe();
  commitFilesSubscription.unsubscribe();

  viewSwitchSubscription.unsubscribe();
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
