<template>
  <q-menu
    ref="menu"
    @hide="emit('hide:menu')"
    class="file-explorer-action-menu"
    data-cy="file-explorer-action-menu"
  >
    <q-list style="min-width: 150px">
      <template v-if="file.isFolder">
        <q-item
          clickable
          @click="createFile(true)"
          data-cy="create-folder-action-item"
        >
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-folder-plus"
            />
          </q-item-section>
          <q-item-section>
            {{ $t('actions.fileExplorer.newFolder') }}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          @click="createFile(false)"
          data-cy="create-file-action-item"
        >
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-file-circle-plus"
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
          data-cy="git-add-file-action-item"
        >
          <q-item-section avatar>
            <q-icon
              color="primary"
              size="xs"
              name="fa-solid fa-plus"
            />
          </q-item-section>
          <q-item-section>
            {{ $t('actions.fileExplorer.addFile') }}
          </q-item-section>
        </q-item>
        <q-linear-progress
          v-if="loading.add"
          color="primary"
          indeterminate
          data-cy="git-add-loader"
        />
      </template>
      <q-item
        v-if="!file.isRootFolder"
        clickable
        @click="deleteFile"
        data-cy="delete-file-action-item"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            size="xs"
            name="fa-solid fa-trash"
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
 * Add selected file and send AddEvent.
 * @param {Object} file - Selected file.
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
