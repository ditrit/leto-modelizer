<template>
  <div
    class="col"
    data-cy="file-tabs"
  >
    <q-tabs
      v-model="activeFileId"
      dense
      class="text-grey bg-grey-2 tab-container"
      active-color="primary"
      indicator-color="transparent"
      align="left"
      data-cy="file-tabs-container"
    >
      <file-tab-header
        v-for="file in fileTabArray"
        :key="file.id"
        :file="file"
        :is-active="(file.id === activeFileId)"
        @update:close-file="deleteFileTab"
      />
    </q-tabs>
    <q-tab-panels v-model="activeFileId">
      <q-tab-panel
        v-for="file in fileTabArray"
        :key="file.id"
        :name="file.id"
        :data-cy="`file-tab-panel_${file.label}`"
      >
        <slot :file="file" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import FileTabHeader from 'src/components/tab/FileTabHeader.vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import { exists, getStatus } from 'src/composables/Project';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const fileTabArray = ref([]);
const activeFileId = ref(null);

let selectFileNodeSubscription;
let deleteFileSubscription;
let updateEditorContentSubscription;
let addRemoteSubscription;
let checkoutSubscription;
let pullSubscription;
let addFileSubscription;
let commitFilesSubscription;
let globalUploadFilesEventSubscription;

/**
 * Update activeFileId by setting its id equal to the last element of fileTabArray,
 * otherwise null if fileTabArray is empty. Emit SelectFileTabEvent.
 */
function setLastFileActive() {
  if (fileTabArray.value.length) {
    activeFileId.value = fileTabArray.value[fileTabArray.value.length - 1].id;
  } else {
    activeFileId.value = null;
  }

  FileEvent.SelectFileTabEvent.next(activeFileId.value);
}

/**
 * Close file tab by removing it from fileTabArray array using its id.
 * Update activeFileId if the closed file was the current active file tab.
 * @param {String} fileId - Id of closed file.
 */
function deleteFileTab(fileId) {
  fileTabArray.value = fileTabArray.value.filter(({ id }) => !id.startsWith(fileId));

  if (activeFileId.value && activeFileId.value.startsWith(fileId)) {
    setLastFileActive();
  }
}

/**
 * When a new file is selected, add it to fileTabArray and update activeFileId.
 * @param {Object} node - Selected node.
 */
function onSelectFileNode(node) {
  if (!fileTabArray.value.some(({ id }) => id === node.id)) {
    fileTabArray.value.push(node);
  }

  activeFileId.value = node.id;
}

/**
 * Update status of the fileTab corresponding to the given parameter.
 * @param {String} filePath - Path correponding to the fileTab id.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateFileStatus(filePath) {
  if (fileTabArray.value.length === 0) {
    return;
  }

  const [fileStatus] = await getStatus(props.projectName, [filePath], (path) => path === filePath);
  const index = fileTabArray.value.findIndex((fileTab) => fileTab.id === filePath);

  if (index !== -1) {
    fileTabArray.value[index].information = fileStatus;
  }
}

/**
 * Update status of all the fileTabs corresponding to the given parameter.
 * @param {String[]} allFilePaths - Array of path correponding to the id of the fileTabs.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateAllFilesStatus(allFilePaths) {
  if (fileTabArray.value.length === 0) {
    return;
  }

  // update return of GitEvent.CommitEvent
  // const allFilePaths = event.map(({ path }) => path);
  const allFileStatus = await getStatus(
    props.projectName,
    allFilePaths,
    (path) => allFilePaths.includes(path),
  );

  allFileStatus.forEach((fileStatus) => {
    const index = fileTabArray.value.findIndex((fileTab) => fileTab.id === fileStatus.path);

    if (index !== -1) {
      fileTabArray.value[index].information = fileStatus;
    }
  });
}

/**
 * Update fileTab array and all there status.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateAllFileTabs() {
  await Promise.allSettled(
    fileTabArray.value.map(
      (fileTab) => exists(`${props.projectName}/${fileTab.id}`).then((exist) => ({ fileTab, exist })),
    ),
  ).then((results) => {
    fileTabArray.value = results
      .filter(({ status, value }) => status === 'fulfilled' && value.exist)
      .map(({ value }) => value.fileTab);
  });

  setLastFileActive();

  await updateAllFilesStatus(
    fileTabArray.value.map(
      ({ id }) => id,
    ),
  );
}

watch(activeFileId, () => {
  FileEvent.SelectFileTabEvent.next(activeFileId.value);
});

onMounted(() => {
  selectFileNodeSubscription = FileEvent.SelectFileNodeEvent.subscribe(onSelectFileNode);
  deleteFileSubscription = FileEvent.DeleteFileEvent.subscribe(({ id }) => deleteFileTab(id));
  updateEditorContentSubscription = FileEvent.UpdateEditorContentEvent.subscribe(updateFileStatus);
  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(updateAllFileTabs);
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(updateAllFileTabs);
  pullSubscription = GitEvent.PullEvent.subscribe(updateAllFileTabs);
  addFileSubscription = GitEvent.AddEvent.subscribe(updateFileStatus);
  commitFilesSubscription = GitEvent.CommitEvent.subscribe(
    (event) => updateAllFilesStatus(event.map(({ path }) => path)),
  );
  globalUploadFilesEventSubscription = FileEvent.GlobalUploadFilesEvent
    .subscribe(updateAllFileTabs);
});

onUnmounted(() => {
  selectFileNodeSubscription.unsubscribe();
  deleteFileSubscription.unsubscribe();
  updateEditorContentSubscription.unsubscribe();
  addRemoteSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
  pullSubscription.unsubscribe();
  addFileSubscription.unsubscribe();
  commitFilesSubscription.unsubscribe();
  globalUploadFilesEventSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
  .tab-container {
    box-shadow: inset 0 -1px 0 #eee
  }
</style>
