<template>
  <div
    class="modelizer-text-view row"
    data-cy="modelizer-text-view"
  >
    <div class="col-2 bg-grey-2 file-explorer-container">
      <git-branch-card/>
      <file-explorer
        class="q-pa-md overflow-auto"
        :nodes="nodes"
        :project-name="projectName"
      />
    </div>

    <q-separator vertical />

    <file-tabs
      :files="files"
      v-model="activeFileId"
      @update:close-file="closeFile"
    >
      <template v-slot="{ file }">
        <monaco-editor
          :content="file.content"
          :viewType="viewType"
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
import { getProjectFiles, readProjectFile } from 'src/composables/Project';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';

const props = defineProps({
  viewType: {
    type: String,
    default: 'model',
  },
  projectName: {
    type: String,
    required: true,
  },
});

const files = ref([]);
const activeFileId = ref('');
const nodes = ref([]);

let fileEventSubscription;
let updateRemoteSubscription;
let checkoutSubscription;

/**
 * Update files array when a new file is open
 *
 * @param {Object} file
 * Example: { id: 'terraform/app.tf', label: 'app.tf', content: 'Hello World' },
 */
function onOpenFileEvent(file) {
  activeFileId.value = file.id;
  const existingFile = files.value.find(({ id }) => id === file.id);
  if (!existingFile) {
    files.value.push(file);
  }
}

/**
 * Update active file id by setting the value equal to the last element of files,
 * otherwise null if files is empty.
 */
function updateActiveFileId() {
  if (files.value.length) {
    activeFileId.value = files.value[files.value.length - 1].id;
    FileEvent.SelectFileEvent.next(activeFileId.value);
  } else {
    activeFileId.value = '';
    FileEvent.SelectFileEvent.next('');
  }
}

/**
 * Close file by removing it from files array using its id.
 * If the closed file was the current active file, update activeFileId.
 *
 * @param {string} fileId - id of closed file
 */
function closeFile(fileId) {
  const index = files.value.findIndex((file) => file.id === fileId);
  if (index !== -1) {
    files.value.splice(index, 1);
  }
  if (fileId === activeFileId.value) {
    updateActiveFileId();
  }
}

/**
 * Update project nodes and files.
 * If the previous active file is not contained in files, update activeFileId.
 */
function updateProjectFiles() {
  getProjectFiles(props.projectName)
    .then((fileInformations) => {
      nodes.value = getTree(props.projectName, fileInformations);
      const projectFilesIds = fileInformations.map((file) => file.path);
      files.value = files.value.filter(({ id }) => projectFilesIds.includes(id));
      files.value.forEach((file) => {
        readProjectFile(props.projectName, { path: file.id })
          .then(({ content }) => {
            file.content = content;
          });
      });
      const isActiveFileInFiles = files.value.find(({ id }) => id === activeFileId.value);
      if (!isActiveFileInFiles) {
        updateActiveFileId();
      }
    });
}

watch(activeFileId, () => {
  FileEvent.SelectFileEvent.next(activeFileId.value);
});

onMounted(() => {
  updateProjectFiles();
  fileEventSubscription = FileEvent.OpenFileEvent.subscribe(onOpenFileEvent);
  updateRemoteSubscription = GitEvent.UpdateRemoteEvent.subscribe(updateProjectFiles);
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(updateProjectFiles);
});

onUnmounted(() => {
  fileEventSubscription.unsubscribe();
  updateRemoteSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
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
