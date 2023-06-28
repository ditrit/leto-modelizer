<template>
  <q-tree
    ref="fileExplorerRef"
    :nodes="nodes"
    node-key="id"
    :no-nodes-label="$t('actions.fileExplorer.empty')"
    dense
    icon="fa-solid fa-chevron-right"
    no-transition
    no-selection-unset
    class="file-explorer"
    :filter="filterTrigger"
    :filter-method="filterParsableFiles"
    data-cy="file-explorer"
  >
    <template #default-header="{expanded, node}">
      <div
        :class="[
          'tree-node-container tree-node items-center',
          {'text-bold' : activeFileId === node.id && !node.isFolder},
          {'text-grey text-italic' : showParsableFiles && isFolderWithoutParsableFiles(node)},
        ]"
        @dblclick="onNodeDoubleClicked(node)"
      >
        <div>
          <q-icon
            class="q-mx-sm"
            color="primary"
            size="xs"
            :name="`${node.icon}${expanded ? '-open' : ''}`"
            :data-cy="`${node.isFolder ? 'folder': 'file'}-icon_${node.id}`"
          />
          <file-name
            class="tree-node"
            :path="node.id"
            :is-active="activeFileId === node.id"
            :label="node.label"
            :status="node.information?.status"
            :is-folder="node.isFolder"
          />
        </div>
        <span class="col-grow" />
        <div class="row no-wrap">
          <file-explorer-action-card
            class="file-explorer-button"
            :file="node"
            :project-name="projectName"
            :data-cy="`${node.isFolder ? 'folder': 'file'}-button_${node.id}`"
          />
        </div>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import FileEvent from 'src/composables/events/FileEvent';
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import GitEvent from 'src/composables/events/GitEvent';
import FileExplorerActionCard from 'src/components/card/FileExplorerActionCard.vue';
import FileName from 'src/components/FileName.vue';
import { getTree } from 'src/composables/FileExplorer';
import { getProjectFiles, getStatus } from 'src/composables/Project';
import { FileInformation } from 'leto-modelizer-plugin-core';
import FileStatus from 'src/models/git/FileStatus';
import { useRoute } from 'vue-router';
import { getPluginByName } from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';

const route = useRoute();
const query = computed(() => route.query);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  showParsableFiles: {
    type: Boolean,
    default: false,
  },
});

const localFileInformations = ref([]);
const fileExplorerRef = ref(null);
const nodes = ref([]);
const activeFileId = ref(null);
// Must be a String according to https://quasar.dev/vue-components/tree
const filterTrigger = ref(props.showParsableFiles.toString());
const defaultFolder = ref(process.env.MODELS_DEFAULT_FOLDER !== ''
  ? `${process.env.MODELS_DEFAULT_FOLDER}/`
  : '');

let selectFileTabSubscription;
let createFileSubscription;
let deleteFileSubscription;
let updateEditorContentSubscription;
let addRemoteSubscription;
let checkoutSubscription;
let pullSubscription;
let addFileSubscription;
let commitFilesSubscription;
let globalUploadFilesEventSubscription;

let pluginInitSubscription;

/**
 * Filter tree nodes to only display parsable files and folders if showParsableFiles is true.
 * @param {Object} node - Node currently being filtered.
 * @returns {Boolean} Result of tested conditions, otherwise true.
 * @see https://quasar.dev/vue-components/tree
 */
function filterParsableFiles(node) {
  let filterResult = true;

  if (props.showParsableFiles) {
    filterResult = node.isParsable || node.isFolder;
  }

  return filterResult;
}

/**
 * Check if node is a folder containing no parsable files.
 * @param {Object} node - Current node.
 * @returns {Boolean} Result of tested conditions.
 */
function isFolderWithoutParsableFiles(node) {
  return node.isFolder && !node.isRootFolder && !node.hasParsableFiles;
}

/**
 * Expand a node by its id. If the created node is a file, update activeFileId with the file's id
 * and send SelectFileNode event.
 * @param {String} parentNodePath - The parent node's path of the created file node.
 * @param {Object} node - The created file node.
 * @param {Boolean} isFolder - True if the created file node is a folder, otherwise false.
 */
function onCreateFileNode({ parentNodePath, node, isFolder }) {
  if (fileExplorerRef.value.getNodeByKey(parentNodePath)) {
    fileExplorerRef.value.setExpanded(parentNodePath, true);

    if (!fileExplorerRef.value.isExpanded(parentNodePath)) {
      // asynchronus behavior not explained (maybe quasar?)
      setTimeout(() => onCreateFileNode({ parentNodePath, node, isFolder }), 1);
      return;
    }

    if (!isFolder) {
      activeFileId.value = node.id;
      FileEvent.SelectFileNodeEvent.next(node);
    }
  }
}

/**
 * Add a new file or folder node to the tree.
 * @param {Object} event - Event containing related information.
 * @param {String} event.name - Name of the created file.
 * @param {Boolean} event.isFolder - True if it's a folder otherwise false.
 * @param {String} event.path - Complete path of created file.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onCreateFile({ name, isFolder, path }) {
  const parentNodePath = path.substring(0, path.lastIndexOf('/')) || props.projectName;

  if (isFolder) {
    // Make empty folder visible by the FileExplorer.
    // TODO: Refacto when FileInformation have isFolder property.
    localFileInformations.value.push(new FileInformation({ path: `${path}/__empty__` }));
    nodes.value = getTree(props.projectName, localFileInformations.value);

    onCreateFileNode({ parentNodePath, node: null, isFolder });
  } else {
    const [fileStatus] = await getStatus(
      props.projectName,
      [path],
      (filePath) => filePath === path,
    );

    localFileInformations.value.push(fileStatus);
    nodes.value = getTree(props.projectName, localFileInformations.value);

    onCreateFileNode({
      parentNodePath,
      node: { id: path, label: name, information: fileStatus },
      isFolder,
    });
  }
}

/**
 * Delete the node corresponding to the file parameter.
 * If this is the last node of the parent node (folder),
 * add a fake '__empty__' node to keep the parent node visible.
 * @param {Object} file - File to delete.
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
  nodes.value = getTree(props.projectName, localFileInformations.value);
}

/**
 * Update status of the node corresponding to the given parameter.
 * @param {String} filePath - Path of the file which status should be updated.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateFileStatus(filePath) {
  const [fileStatus] = await getStatus(props.projectName, [filePath], (path) => path === filePath);
  const index = localFileInformations.value
    .findIndex((fileInformation) => fileInformation.path === filePath);

  localFileInformations.value[index] = fileStatus;
  nodes.value = getTree(props.projectName, localFileInformations.value);
}

/**
 * If node doubleclicked is a file, set activeFileId value to the file's id and
 * send SelectFileNode event.
 * @param {Object} node - Tree node.
 * Example { icon: "fa-regular fa-file", id: "terraform/app.tf", isFolder: false, label: "app.tf" }
 */
function onNodeDoubleClicked(node) {
  if (node.isFolder) {
    return;
  }

  activeFileId.value = node.id;
  FileEvent.SelectFileNodeEvent.next(node);
}

/**
 * Update status of all nodes.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateAllFilesStatus() {
  const allStatus = await getStatus(props.projectName);

  localFileInformations.value = localFileInformations.value.map(
    (file) => allStatus.find(({ path }) => file.path === path)
      || new FileStatus({ path: file.path }),
  );

  nodes.value = getTree(props.projectName, localFileInformations.value);
}

/**
 * Expand folder tree node.
 * @param {string} folder - Path of the folder.
 */
function expandFolder(folder) {
  const node = fileExplorerRef.value.getNodeByKey(folder);

  if (node) {
    fileExplorerRef.value.setExpanded(folder, true);
  }
}

/**
 * Open file tree node.
 * @param {string} file - Path of the file.
 */
function openFile(file) {
  const node = fileExplorerRef.value.getNodeByKey(file);

  if (node) {
    activeFileId.value = node.id;
    FileEvent.SelectFileNodeEvent.next(node);
  }
}

/**
 * Expand folder tree nodes corresponding to the selected model.
 * Only expand the ones containing parsable file tree nodes.
 * Then, open those file tree nodes.
 */
function openModelFiles() {
  const [pluginName, modelName] = query.value.path.split('/');
  const plugin = getPluginByName(pluginName);

  // TODO: Find a better way to stub it on shallowMount.
  if (!plugin || !fileExplorerRef.value.getNodeByKey || !query.value.path) {
    return;
  }

  expandFolder(props.projectName);

  if (defaultFolder.value !== '') {
    expandFolder(defaultFolder.value);
  }

  if (pluginName?.length > 0) {
    expandFolder(`${defaultFolder.value}${pluginName}`);

    if (modelName?.length > 0) {
      expandFolder(`${defaultFolder.value}${pluginName}/${modelName}`);

      const allPaths = localFileInformations.value
        .filter(({ path }) => path.startsWith(`${defaultFolder.value}${pluginName}/${modelName}/`))
        .filter(({ path }) => plugin.isParsable({ path }))
        .map(({ path }) => path);

      allPaths.forEach((path) => {
        path.split('/').reduce((acc, value) => {
          acc = acc ? `${acc}/${value}` : value;

          if (acc !== path) {
            expandFolder(acc);
          }

          return acc;
        }, null);

        openFile(path);
      });
    }
  }
}

/**
 * Update localFileInformations and nodes of the tree then update all status.
 * Also, expand model folders and open parsable files.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function initTreeNodes() {
  localFileInformations.value = await getProjectFiles(props.projectName);

  nodes.value = getTree(props.projectName, localFileInformations.value);

  await updateAllFilesStatus();
  openModelFiles();
}

onMounted(async () => {
  selectFileTabSubscription = FileEvent.SelectFileTabEvent.subscribe((id) => {
    activeFileId.value = id;
  });
  createFileSubscription = FileEvent.CreateFileEvent.subscribe((event) => {
    onCreateFile(event);
  });
  deleteFileSubscription = FileEvent.DeleteFileEvent.subscribe(onDeleteFile);
  updateEditorContentSubscription = FileEvent.UpdateEditorContentEvent.subscribe((event) => {
    updateFileStatus(event);
  });
  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(() => {
    initTreeNodes();
  });
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(() => {
    initTreeNodes();
  });
  pullSubscription = GitEvent.PullEvent.subscribe(() => {
    initTreeNodes();
  });
  addFileSubscription = GitEvent.AddEvent.subscribe((event) => {
    updateFileStatus(event);
  });
  commitFilesSubscription = GitEvent.CommitEvent.subscribe(() => {
    updateAllFilesStatus();
  });
  globalUploadFilesEventSubscription = FileEvent.GlobalUploadFilesEvent.subscribe(() => {
    initTreeNodes();
  });

  pluginInitSubscription = PluginEvent.InitEvent.subscribe(openModelFiles);

  await initTreeNodes();
  openModelFiles();
});

onUnmounted(() => {
  selectFileTabSubscription.unsubscribe();
  createFileSubscription.unsubscribe();
  deleteFileSubscription.unsubscribe();
  updateEditorContentSubscription.unsubscribe();
  addRemoteSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
  pullSubscription.unsubscribe();
  addFileSubscription.unsubscribe();
  commitFilesSubscription.unsubscribe();
  globalUploadFilesEventSubscription.unsubscribe();

  pluginInitSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.tree-node:hover {
  cursor: pointer;
}
.tree-node {
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.tree-node-container {
  width: 100%;
  display: inline-flex;
  padding: 1px 0px;

  &:hover {
    background: rgba($primary, 0.1);
    border-radius: 4px;

    .file-explorer-button {
      display: inline-block
    }
  }
}
.file-explorer-button {
  display: none
}
</style>

<style lang="scss">
/*
 * Target tree to override quasar `.q-focus-helper` default background style.
 * This style is not applied if used within scoped style
 */
.file-explorer .q-focus-helper {
  background: transparent !important;
}
</style>
