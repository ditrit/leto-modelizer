<template>
  <default-dialog
    dialog-key="DeleteFile"
    data-cy="delete-file-dialog"
  >
    <template v-slot:title>
      <q-icon
        color="primary"
        :name="isFolder ? 'fa-solid fa-folder-minus' : 'fa-solid fa-file-circle-minus'"
      />
      {{ $t(`page.modelizer.fileExplorer.delete.${ isFolder ? 'folder' : 'file' }.title`) }}
    </template>
    <template v-slot:default>
      <div
        class="q-pb-lg"
        v-html="$t(
          `page.modelizer.fileExplorer.delete.${ isFolder ? 'folder' : 'file' }.description`,
          { name: deletedFile.label },
        )"
      >
      </div>
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
import DefaultDialog from 'components/dialog/DefaultDialog';
import DeleteFileForm from 'components/form/DeleteFileForm';

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
 * @param {String} key - Event key.
 * @param {Object} file - Event file.
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
