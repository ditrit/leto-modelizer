<template>
  <div class="col" data-cy="file-tabs">
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
        :isActive="(file.id === activeFileId)"
        @update:close-file="deleteFileTab"
      />
    </q-tabs>
    <q-tab-panels v-model="activeFileId">
      <q-tab-panel
        v-for="file in fileTabArray"
        :key="file.id"
        :name="file.id"
        :data-cy="`file-tab-content-${file.label}`"
      >
        <slot :file="file"></slot>
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

const props = defineProps({
  fileInformations: {
    type: Object,
    required: true,
  },
});

const fileTabArray = ref([]);
const activeFileId = ref(null);

let selectFileNodeSubscription;

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
  fileTabArray.value = fileTabArray.value.filter(({ id }) => id !== fileId);

  if (fileId === activeFileId.value) {
    setLastFileActive();
  }
}

/**
 * When a new file is selected, add it to fileTabArray and update activeFileId.
 * @param {Object} node - Selected node.
 */
function onSelectFileNode(node) {
  if (!fileTabArray.value.some(({ id }) => id === node.id)) {
    fileTabArray.value.push({
      id: node.id,
      label: node.label,
      information: props.fileInformations.find(({ path }) => path === node.id),
    });
  }

  activeFileId.value = node.id;
}

/**
 * Update fileTabArray when props.fileInformations is updated.
 * If the previous selected file no longer exists, update activeFileId.
 */
function updateFileTabs() {
  const projectFilesIds = props.fileInformations.map((file) => file.path);
  fileTabArray.value = fileTabArray.value
    .filter(({ id }) => projectFilesIds.includes(id))
    .map((fileTab) => ({
      ...fileTab,
      information: props.fileInformations.find(({ path }) => path === fileTab.id),
    }));

  const isActiveFileInFiles = fileTabArray.value
    .find(({ id }) => id === activeFileId.value);

  if (!isActiveFileInFiles) {
    setLastFileActive();
  }
}

watch(() => props.fileInformations, () => {
  updateFileTabs();
}, { deep: true });

watch(activeFileId, () => {
  FileEvent.SelectFileTabEvent.next(activeFileId.value);
});

onMounted(() => {
  selectFileNodeSubscription = FileEvent.SelectFileNodeEvent.subscribe(onSelectFileNode);
});

onUnmounted(() => {
  selectFileNodeSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
  .tab-container {
    box-shadow: inset 0 -1px 0 #eee
  }
</style>
