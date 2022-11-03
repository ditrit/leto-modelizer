<template>
  <q-form
    @submit="onSubmit"
    data-cy="create-file-form"
    class="q-gutter-md create-file-form"
  >
    <q-input
      v-model="fileName"
      filled
      :label="$t(`page.modelizer.fileExplorer.create.${isFolder ? 'folder' : 'file'}.input`)"
      lazy-rules
      data-cy="create-file-input"
      :rules="[
        (v) => notEmpty(t, v),
        (v) => isValidFileLabel($t, v),
        (v) => isUniqueFileLabel($t, file.children, v),
      ]"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.save')"
        type="submit"
        :loading="submitting"
        data-cy="create-file-submit"
        color="positive"
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
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { notEmpty, isValidFileLabel, isUniqueFileLabel } from 'src/composables/QuasarFieldRule';
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
 */
function onSubmit() {
  const parent = props.file.id === props.projectName ? '' : `${props.file.id}/`;
  const promise = props.isFolder ? createProjectFolder : writeProjectFile;
  const path = props.isFolder ? `${parent}${fileName.value}` : new FileInput({
    path: `${parent}${fileName.value}`,
    content: ' ',
  });
  submitting.value = true;

  return promise(props.projectName, path).then(() => {
    emit('file:create', fileName.value);
    Notify.create({
      type: 'positive',
      message: t('actions.fileExplorer.file.create'),
      html: true,
    });

    FileEvent.CreateFileEvent.next({
      name: fileName.value.substring(fileName.value.lastIndexOf('/') + 1),
      isFolder: props.isFolder,
    });
  }).catch(() => {
    Notify.create({
      type: 'negative',
      message: t(`errors.fileExplorer.default.${props.isFolder ? 'folder' : 'file'}.create`),
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
