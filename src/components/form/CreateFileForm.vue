<template>
  <q-form
    class="q-gutter-md create-file-form"
    data-cy="create-file-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="fileName"
      filled
      :label="$t(`page.modelizer.fileExplorer.create.${isFolder ? 'folder' : 'file'}.input`)"
      lazy-rules
      :rules="[
        (value) => notEmpty(t, value),
        (value) => isValidFileLabel($t, value),
        (value) => isUnique(
          $t,
          file.children.map(({ label }) => label),
          value,
          'errors.fileExplorer.label.duplicate',
        ),
      ]"
      data-cy="name-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.save')"
        type="submit"
        :loading="submitting"
        color="positive"
        data-cy="submit-button"
      >
        <template #loading>
          <q-spinner-dots />
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { notEmpty, isValidFileLabel, isUnique } from 'src/composables/QuasarFieldRule';
import { createProjectFolder, writeProjectFile } from 'src/composables/Project';
import { FileInput } from 'leto-modelizer-plugin-core';
import FileEvent from 'src/composables/events/FileEvent';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  file: {
    type: Object,
    required: true,
  },
  isFolder: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['file:create']);
const { t } = useI18n();
const fileName = ref('');
const submitting = ref(false);

/**
 * Emit new fileName and send positive toast.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
function onSubmit() {
  const filePath = `${props.file.id}/${fileName.value}`;
  const createFile = props.isFolder
    ? createProjectFolder(filePath)
    : writeProjectFile(new FileInput({
      path: filePath,
      content: '',
    }));
  const type = props.isFolder ? 'folder' : 'file';

  submitting.value = true;

  return createFile.then(() => {
    emit('file:create', fileName.value);
    Notify.create({
      type: 'positive',
      message: t(`actions.fileExplorer.${type}.create`),
      html: true,
    });

    FileEvent.CreateFileEvent.next({
      name: fileName.value.substring(fileName.value.lastIndexOf('/') + 1),
      isFolder: props.isFolder,
      path: filePath,
    });
  }).catch(() => {
    Notify.create({
      type: 'negative',
      message: t(`errors.fileExplorer.default.${type}.create`),
      html: true,
    });
  }).finally(() => {
    submitting.value = false;
  });
}
</script>

<style lang="scss">
.create-file-form {
  min-width: 400px;
}
</style>
