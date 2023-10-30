<template>
  <default-dialog
    dialog-key="CreateFile"
    data-cy="create-file-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-file-circle-plus"
      />
      {{ $t(`page.modelizer.fileExplorer.create.${onFolder ? 'folder' : 'file'}.title`) }}
    </template>
    <template #default>
      <create-file-form
        :project-name="projectName"
        :file="newFile"
        :is-folder="onFolder"
        @file:create="DialogEvent.next({ type: 'close', key: 'CreateFile' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import CreateFileForm from 'components/form/CreateFileForm.vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const newFile = ref(null);
const onFolder = ref(null);
let dialogEventSubscription;

/**
 * Set newFile and onFolder on valid event.
 * @param {object} event - Event.
 * @param {string} event.key - Event key.
 * @param {object} event.file - Event file.
 * @param {boolean} event.isFolder - True if file node is a folder, otherwise false.
 */
function setFileNode({ key, file, isFolder }) {
  if (key === 'CreateFile') {
    newFile.value = file;
    onFolder.value = isFolder;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setFileNode);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
