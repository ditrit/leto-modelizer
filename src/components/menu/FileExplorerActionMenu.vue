<template>
  <q-menu
    ref="menu"
    class="file-explorer-action-menu"
    data-cy="file-explorer-action-menu"
    @hide="emit('hide:menu')"
  >
    <q-list style="min-width: 150px">
      <template v-if="file.isFolder">
        <q-item
          clickable
          data-cy="create-folder-action-item"
          @click="createFile(true)"
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
          data-cy="create-file-action-item"
          @click="createFile(false)"
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
          data-cy="git-add-file-action-item"
          @click="addFile(file)"
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
        data-cy="delete-file-action-item"
        @click="deleteFile"
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
import { getStatus, gitAdd } from 'src/composables/Project';
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
 * @param {boolean} isFolder - True if creating a folder, otherwise false.
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
 * @param {object} file - Selected file.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function addFile(file) {
  loading.value.add = true;
  return gitAdd(props.projectName, file.id)
    .then(async () => {
      Notify.create({
        type: 'positive',
        message: t('actions.fileExplorer.file.add'),
        html: true,
      });

      const [fileStatus] = await getStatus(
        props.projectName,
        [file.id],
        (path) => path === file.id,
      );

      GitEvent.AddEvent.next(fileStatus);
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
