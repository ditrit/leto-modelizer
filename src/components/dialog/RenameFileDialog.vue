<template>
  <default-dialog
    dialog-key="RenameFile"
    data-cy="rename-file-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-pen"
      />
      {{
        $t(`page.modelizer.fileExplorer.rename.${fileToRename.isFolder ? 'folder' : 'file'}.title`)
      }}
    </template>
    <template #default>
      <rename-file-form
        :project-name="projectName"
        :file="fileToRename"
        @file:rename="DialogEvent.next({ type: 'close', key: 'RenameFile' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import RenameFileForm from 'components/form/RenameFileForm.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const fileToRename = ref(null);

let dialogEventSubscription;

/**
 * Set renamed file name on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event type.
 * @param {string} event.file - File to rename.
 */
function setRenamedFile({ key, file }) {
  if (key === 'RenameFile') {
    fileToRename.value = file;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setRenamedFile);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
