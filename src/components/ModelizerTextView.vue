<template>
  <div
    class="modelizer-text-view row"
    data-cy="modelizer-text-view"
  >
    <div class="col-md-2 bg-grey-2 file-explorer-container">
      <git-branch-card />
      <q-checkbox
        v-model="showParsableFiles"
        class="q-ml-lg"
        left-label
        :label="$t('page.modelizer.fileExplorer.filterParsableFiles')"
      />
      <file-explorer
        class="q-px-md q-py-sm overflow-auto"
        :file-informations="localFileInformations"
        :project-name="projectName"
        :show-parsable-files="showParsableFiles"
      />
    </div>

    <q-separator vertical />
    <file-tabs
      :file-informations="localFileInformations"
    >
      <template #default="{ file }">
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
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import {
  getProjectFiles,
  getStatus,
  getAllModels,
} from 'src/composables/Project';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import { FileInformation } from 'leto-modelizer-plugin-core';
import FileStatus from 'src/models/git/FileStatus';
import PluginEvent from 'src/composables/events/PluginEvent';
import { useRoute, useRouter } from 'vue-router';
import { getPluginByName, renderModel } from 'src/composables/PluginManager';

const router = useRouter();
const route = useRoute();
const query = computed(() => route.query);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const localFileInformations = ref([]);
const showParsableFiles = ref(false);
const selectedFileTabPath = ref(null);

let globalUploadFilesEventSubscription;
let updateEditorContentSubscription;
let createFileSubscription;
let deleteFileSubscription;
let addRemoteSubscription;
let checkoutSubscription;
let pullSubscription;
let pushSubscription;
let addFileSubscription;
let commitFilesSubscription;
let selectFileTabSubscription;
let viewSwitchSubscription;

/**
 * Get the new status of the updated file, then update localFileInformations accordingly.
 * @param {String} filePath - Path (id) of the updated file.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateFileStatus(filePath) {
  const [fileStatus] = await getStatus(props.projectName, [filePath], (path) => path === filePath);
  const index = localFileInformations.value
    .findIndex((fileInformation) => fileInformation.path === filePath);
  localFileInformations.value[index] = fileStatus;
}

/**
 * Get the status of all files, then update localFileInformations accordingly.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateAllFilesStatus() {
  const allStatus = await getStatus(props.projectName);
  localFileInformations.value = localFileInformations.value.map(
    (file) => allStatus.find(({ path }) => file.path === path)
      || new FileStatus({ path: file.path }),
  );
}

/**
 * Get FileInformation of all files, then update localFileInformations accordingly.
 * Then get the status of all files, then update localFileInformations accordingly.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateProjectFiles() {
  const fileInformations = await getProjectFiles(props.projectName);
  localFileInformations.value = fileInformations;

  await updateAllFilesStatus();
}

/**
 * Get the new status of the committed files, then update localFileInformations accordingly.
 * @param {Array} committedFiles - Array of path (id) of the committed files.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onCommitFiles(committedFiles) {
  const filePaths = committedFiles.map(({ path }) => path);

  const fileStatus = await getStatus(
    props.projectName,
    filePaths,
    (path) => filePaths.includes(path),
  );

  localFileInformations.value = localFileInformations.value
    .map((fileInformation) => fileStatus.find(({ path }) => path === fileInformation.path)
      || fileInformation);
}

/**
 * Add created file to localFileInformations and send CreateFileNode event.
 * @param {String} name - Name of the created file.
 * @param {Boolean} isFolder - True if the created file is a folder, otherwise false.
 * @param {String} path - Path (id) of the created file.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onCreateFile({ name, isFolder, path }) {
  const parentNodePath = path.substring(0, path.lastIndexOf('/')) || props.projectName;

  if (isFolder) {
    // Make empty folder visible by the FileExplorer.
    // TODO: Refacto when FileInformation have isFolder property.
    localFileInformations.value.push(new FileInformation({ path: `${path}/__empty__` }));
    FileEvent.CreateFileNodeEvent.next({ parentNodePath, node: null, isFolder });
  } else {
    const [fileStatus] = await getStatus(
      props.projectName,
      [path],
      (filePath) => filePath === path,
    );

    localFileInformations.value.push(fileStatus);
    FileEvent.CreateFileNodeEvent.next({
      parentNodePath,
      node: { id: path, label: name },
      isFolder,
    });
  }
}

/**
 * Remove deleted file from localFileInformations.
 * @param {Object} file - The deleted file.
 */
function onDeleteFile(file) {
  const fileInformations = localFileInformations.value
    .filter(({ path }) => (file.isFolder ? !path.startsWith(`${file.id}/`) : path !== file.id));
  const parentPath = file.id.slice(0, file.id.lastIndexOf('/') + 1);

  if (!fileInformations.some(({ path }) => path.startsWith(parentPath))) {
    // Make empty folder visible by the FileExplorer.
    // TODO: Refacto when FileInformation have isFolder property.
    fileInformations.push(new FileInformation({ path: `${parentPath}__empty__` }));
  }

  localFileInformations.value = fileInformations;
}

/**
 * Render components and update files accordingly.
 * @return {Promise<void>} Promise with an object containing the created files list
 * and the updated files list on success otherwise an error.
 */
// TODO: Remove when ModelView refacto will be done.
async function renderPluginFiles(pluginName) {
  const plugin = await getPluginByName(pluginName);

  const modelpath = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/${query.value.path}`
    : `${query.value.path}`;

  return renderModel(props.projectName, modelpath, plugin)
    .then((allResults) => {
      PluginEvent.RenderEvent.next(allResults);

      return allResults.reduce((acc, file) => {
        if (localFileInformations.value.find(({ path }) => file.path === path)) {
          acc.updatedFiles.push(file);
        } else {
          acc.createdFiles.push(file);
        }

        return acc;
      }, { createdFiles: [], updatedFiles: [] });
    });
}

/**
 * Get model corresponding to the active file.
 * @return {Promise<Object>} Promise with the model or null on success otherwise an error.
 */
async function getModel() {
  if (selectedFileTabPath.value) {
    const models = await getAllModels(props.projectName);

    const defaultFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
      ? `${process.env.MODELS_DEFAULT_FOLDER}/`
      : '';

    return models.find(({ name, plugin }) => selectedFileTabPath.value.startsWith(
      `${defaultFolder}${plugin}/${name}/`,
    ));
  }

  return Promise.resolve();
}

/**
 * On switch to 'text' view, update project files and send CreateFileNode event for each
 * files created after calling renderPluginFiles.
 * Also send UpdateFileContent event if renderPluginFiles returns any updated files.
 * @param {String} newViewType - Updated view type.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onSwitchView(viewType) {
  if (viewType === 'draw') {
    const model = await getModel();
    const modelPath = model ? `${model.plugin}/${model.name}` : query.value.path;

    router.push({
      name: 'modelizer',
      params: {
        viewType,
        projectName: props.projectName,
      },
      query: {
        path: modelPath,
      },
    });

    return;
  }

  // TODO: Refactor to delete renderPluginFiles(), because not needed.
  const { createdFiles, updatedFiles } = await renderPluginFiles(query.value.path.split('/')[0]);
  await updateProjectFiles();

  createdFiles.forEach((file) => {
    const parentNodePath = file.path
      .substring(0, file.path.lastIndexOf('/')) || props.projectName;

    FileEvent.CreateFileNodeEvent.next({
      parentNodePath,
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
  globalUploadFilesEventSubscription = FileEvent.GlobalUploadFilesEvent
    .subscribe(updateProjectFiles);
  createFileSubscription = FileEvent.CreateFileEvent.subscribe(onCreateFile);
  deleteFileSubscription = FileEvent.DeleteFileEvent.subscribe(onDeleteFile);
  updateEditorContentSubscription = FileEvent.UpdateEditorContentEvent
    .subscribe(updateFileStatus);

  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(updateProjectFiles);
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(updateProjectFiles);
  pullSubscription = GitEvent.PullEvent.subscribe(updateProjectFiles);
  pushSubscription = GitEvent.PushEvent.subscribe(updateAllFilesStatus);
  addFileSubscription = GitEvent.AddEvent.subscribe(updateFileStatus);
  commitFilesSubscription = GitEvent.CommitEvent.subscribe(onCommitFiles);

  selectFileTabSubscription = FileEvent.SelectFileTabEvent.subscribe((event) => {
    selectedFileTabPath.value = event;
  });

  viewSwitchSubscription = ViewSwitchEvent.subscribe(onSwitchView);
});

onUnmounted(() => {
  globalUploadFilesEventSubscription.unsubscribe();
  createFileSubscription.unsubscribe();
  deleteFileSubscription.unsubscribe();
  updateEditorContentSubscription.unsubscribe();

  addRemoteSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
  pullSubscription.unsubscribe();
  pushSubscription.unsubscribe();
  addFileSubscription.unsubscribe();
  commitFilesSubscription.unsubscribe();

  selectFileTabSubscription.unsubscribe();

  viewSwitchSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.modelizer-text-view {
 // set min-height to full height excluding header height
 // 74px = height of header
  height: calc(100vh - 74px)
}
.file-explorer-container {
  min-width: 200px;
}
</style>
