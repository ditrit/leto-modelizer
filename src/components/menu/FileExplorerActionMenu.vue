<template>
  <q-menu
    @hide="emit('hide:menu')"
    class="tree-action-menu"
    data-cy="tree-action-menu"
    auto-close
  >
    <q-list style="min-width: 150px">
      <template v-if="file.isFolder">
        <q-item clickable @click="addFile(true)">
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-folder-plus"
              data-cy="tree-action-add-folder"
            />
          </q-item-section>
          <q-item-section>
            {{ $t('actions.fileExplorer.newFolder') }}
          </q-item-section>
        </q-item>
        <q-item clickable @click="addFile(false)">
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-file-circle-plus"
              data-cy="tree-action-add-file"
            />
          </q-item-section>
          <q-item-section>
            {{ $t('actions.fileExplorer.newFile') }}
          </q-item-section>
        </q-item>
      </template>
      <q-item v-if="!file.isRootFolder" clickable @click="deleteFile">
        <q-item-section avatar>
          <q-icon
            color="primary"
            size="xs"
            name="fa-solid fa-trash"
            data-cy="tree-action-delete-file"
          />
        </q-item-section>
        <q-item-section>
          {{ $t('actions.default.delete') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';

const emit = defineEmits(['hide:menu']);

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});

/**
 * Send event to open the CreateFileDialog.
 */
function addFile(isFolder) {
  DialogEvent.next({
    type: 'open',
    key: 'CreateFile',
    file: props.file,
    isFolder,
  });
}

/**
 * Send event to open the DeleteFileDialog.
 */
function deleteFile() {
  DialogEvent.next({
    type: 'open',
    key: 'DeleteFile',
    file: props.file,
  });
}
</script>
