<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md delete-file-form"
    data-cy="delete-file-form"
  >
    <q-checkbox
      v-if="isFolderWithChildren"
      v-model="confirmDelete"
      :label="$t('page.modelizer.fileExplorer.delete.folder.confirmDelete')"
      data-cy="confirm-delete-checkbox"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-trash"
        :label="$t('actions.default.delete')"
        type="submit"
        :loading="submitting"
        :disable="isFolderWithChildren && !confirmDelete"
        color="negative"
        data-cy="submit-button"
      >
        <template v-slot:loading>
          <q-spinner-dots/>
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { Notify } from 'quasar';
import { deleteProjectFile } from 'src/composables/Project';
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import FileEvent from 'src/composables/events/FileEvent';

const emit = defineEmits(['file:delete']);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  file: {
    type: Object,
    required: true,
  },
});

const isFolderWithChildren = computed(() => props.file.isFolder
  && props.file.children.length !== 0);

const { t } = useI18n();
const confirmDelete = ref(false);
const submitting = ref(false);

/**
 * Emit new fileName if form is valid and manage toast.
 */
function onSubmit() {
  if (isFolderWithChildren.value && !confirmDelete.value) {
    return Notify.create({
      type: 'negative',
      message: t('errors.fileExplorer.folder.delete'),
      html: true,
    });
  }

  submitting.value = true;

  return deleteProjectFile(props.projectName, props.file.id, props.file.isFolder)
    .then(() => {
      emit('file:delete');
      FileEvent.DeleteFileEvent.next(props.file);
      Notify.create({
        type: 'positive',
        message: t(`actions.fileExplorer.${props.file.isFolder ? 'folder' : 'file'}.delete`),
        html: true,
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t(`errors.fileExplorer.default.${props.isFolder ? 'folder' : 'file'}.delete`),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
    });
}
</script>
