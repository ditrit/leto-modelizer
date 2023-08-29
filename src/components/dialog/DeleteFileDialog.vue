<template>
  <default-dialog
    dialog-key="DeleteFile"
    data-cy="delete-file-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        :name="isFolder ? 'fa-solid fa-folder-minus' : 'fa-solid fa-file-circle-minus'"
      />
      {{ $t(`page.modelizer.fileExplorer.delete.${ isFolder ? 'folder' : 'file' }.title`) }}
    </template>
    <template #default>
      <div
        class="q-pb-lg"
        v-html="$t(
          `page.modelizer.fileExplorer.delete.${ isFolder ? 'folder' : 'file' }.description`,
          { name: deletedFile.label },
        )"
      />
      <delete-file-form
        :project-name="projectName"
        :file="deletedFile"
        @file:delete="DialogEvent.next({ type: 'close', key: 'DeleteFile' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import DeleteFileForm from 'components/form/DeleteFileForm.vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const deletedFile = ref(null);
const isFolder = computed(() => deletedFile.value.isFolder);
let dialogEventSubscription;

/**
 * Set deletedFile on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event key.
 * @param {object} event.file - Event file.
 */
function setDeletedFile({ key, file }) {
  if (key === 'DeleteFile') {
    deletedFile.value = file;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setDeletedFile);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
