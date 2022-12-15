<template>
  <q-menu
    ref="menu"
    @hide="emit('hide:menu')"
    class="file-explorer-menu"
    data-cy="file-explorer-menu"
  >
    <q-list style="min-width: 150px">
      <template v-if="file.isFolder">
        <q-item clickable @click="createFile(true)">
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-folder-plus"
              data-cy="file-explorer-menu-create-folder"
            />
          </q-item-section>
          <q-item-section>
            {{ $t('actions.fileExplorer.newFolder') }}
          </q-item-section>
        </q-item>
        <q-item clickable @click="createFile(false)">
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-file-circle-plus"
              data-cy="file-explorer-menu-create-file"
            />
          </q-item-section>
          <q-item-section>
            {{ $t('actions.fileExplorer.newFile') }}
          </q-item-section>
        </q-item>
      </template>
      <template v-if="isFile && allowGitAdd">
        <q-item
          clickable
          @click="addFile(file)"
        >
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-plus"
              data-cy="file-explorer-menu-add-file"
            />
          </q-item-section>
          <q-item-section>
            {{ $t('actions.fileExplorer.addFile') }}
          </q-item-section>
        </q-item>
        <q-linear-progress
          v-if="loading.add"
          data-cy="file-explorer-menu-add-loader"
          color="primary"
          indeterminate
        />
      </template>
      <q-item v-if="!file.isRootFolder" clickable @click="deleteFile">
        <q-item-section avatar>
          <q-icon
            color="primary"
            size="xs"
            name="fa-solid fa-trash"
            data-cy="file-explorer-menu-delete-file"
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
import { computed, ref } from 'vue';
import { gitAdd } from 'src/composables/Project';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import DialogEvent from 'src/composables/events/DialogEvent';
import GitEvent from 'src/composables/events/GitEvent';

const emit = defineEmits(['hide:menu']);

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const menu = ref(null);
const loading = ref({
  add: false,
});
const isFile = computed(() => !props.file.isFolder);
const allowGitAdd = computed(() => !!props.file.information?.isUntracked
  || !!props.file.information?.isUnstaged
  || !!props.file.information?.hasUnstagedChanged);

/**
 * Send event to open the CreateFileDialog.
 */
function createFile(isFolder) {
  DialogEvent.next({
    type: 'open',
    key: 'CreateFile',
    file: props.file,
    isFolder,
  });
  menu.value.hide();
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
  menu.value.hide();
}

/**
 * Add selected file and send UpdateFile event.
 */
function addFile(file) {
  loading.value.add = true;
  return gitAdd(props.projectName, file.id)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('actions.fileExplorer.file.add'),
        html: true,
      });
      GitEvent.AddEvent.next(file.id);
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.fileExplorer.default.file.add'),
        html: true,
      });
    })
    .finally(() => {
      loading.value.add = false;
      menu.value.hide();
    });
}
</script>
