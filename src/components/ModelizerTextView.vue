<template>
  <div
    class="modelizer-text-view row"
    data-cy="modelizer-text-view"
  >
    <div class="col-md-2 bg-grey-2 file-explorer-container">
      <git-branch-card/>
      <file-explorer
        class="q-pa-md overflow-auto"
        :nodes="nodes"
        :project-name="projectName"
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
import { getProjectFiles, readProjectFile, writeProjectFile } from 'src/composables/Project';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getPlugins } from 'src/composables/PluginManager';
import { FileInformation } from 'leto-modelizer-plugin-core';

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

let openFileSubscription;
let selectNodeSubscription;
let createFileSubscription;
let deleteFileSubscription;
let updateRemoteSubscription;
let checkoutSubscription;
let pluginRenderSubscription;

/**
 * Update fileTabArray array when a new file is open.
 * @param {Object} file
 * Example: { id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' }
 */
function onOpenFileEvent(file) {
  activeFileTab.value = { isSelected: true, id: file.id };

  if (!fileTabArray.value.some(({ id }) => id === file.id)) {
    fileTabArray.value.push(file);
  }
}

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
 */
function updateProjectFiles() {
  return getProjectFiles(props.projectName)
    .then((fileInformations) => {
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
    });
}

/**
 * Set selectedNode to the node param.
 * @param {Object} node - Node tree Object.
 */
function updateSelectedNode(node) {
  selectedNode.value = node;
}

/**
 * Create and add a new file tree, update value of activeFileTab,
 * send ExpandFolder and OpenFile events.
 * @param {String} fileName - Name of the file to create.
 */
function onCreateFileEvent({ name, isFolder }) {
  return updateProjectFiles()
    .then(() => {
      if (isFolder) {
        return Promise.resolve();
      }
      return readProjectFile(props.projectName, new FileInformation({ path: name }));
    })
    .then((fileInput) => {
      if (!isFolder) {
        activeFileTab.value = { isSelected: true, id: fileInput.path };

        FileEvent.OpenFileEvent.next({
          id: fileInput.path,
          label: name.substring(name.lastIndexOf('/') + 1),
          content: fileInput.content,
        });
      }

      let folder = `${selectedNode.value.id || props.projectName}/${name}`;

      if (folder.indexOf('/') > 0) {
        folder = folder.substring(0, folder.lastIndexOf('/'));
      }

      FileEvent.ExpandFolderEvent.next(folder);
    });
}

/**
 * Render components and update files accordingly.
 */
function renderPlugins() {
  const plugins = getPlugins();
  plugins.forEach((plugin) => {
    const render = plugin.renderer.render(plugin.components, [], 'new_file.tf');

    render.forEach((file) => {
      writeProjectFile(props.projectName, file).then(() => {
        FileEvent.CreateFileEvent.next({
          name: file.path.substring(file.path.lastIndexOf('/') + 1),
          isFolder: false,
        });
      });
    });
  });
}

watch(activeFileTab, () => {
  FileEvent.SelectFileEvent.next(activeFileTab.value);
});

onMounted(() => {
  updateProjectFiles();
  openFileSubscription = FileEvent.OpenFileEvent.subscribe(onOpenFileEvent);
  selectNodeSubscription = FileEvent.SelectNodeEvent.subscribe(updateSelectedNode);
  createFileSubscription = FileEvent.CreateFileEvent.subscribe(onCreateFileEvent);
  deleteFileSubscription = FileEvent.DeleteFileEvent.subscribe(updateProjectFiles);
  updateRemoteSubscription = GitEvent.UpdateRemoteEvent.subscribe(updateProjectFiles);
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(updateProjectFiles);
  pluginRenderSubscription = PluginEvent.RenderEvent.subscribe(renderPlugins);
});

onUnmounted(() => {
  openFileSubscription.unsubscribe();
  selectNodeSubscription.unsubscribe();
  createFileSubscription.unsubscribe();
  deleteFileSubscription.unsubscribe();
  updateRemoteSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
  pluginRenderSubscription.unsubscribe();
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
