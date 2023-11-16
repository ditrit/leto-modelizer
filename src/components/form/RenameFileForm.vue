<template>
  <q-form
    class="q-gutter-md rename-file-form"
    data-cy="rename-file-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="fileName"
      filled
      :label="$t(`page.modelizer.fileExplorer.rename.${file.isFolder ? 'folder' : 'file'}.input`)"
      lazy-rules
      :rules="[
        (value) => notEmpty(t, value),
        (value) => isValidFileLabel($t, value),
        (value) => isUnique(
          $t,
          labels,
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
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';
import { notEmpty, isValidFileLabel, isUnique } from 'src/composables/QuasarFieldRule';
import { gitRemove, readDir, rename } from 'src/composables/Project';
import { Notify } from 'quasar';
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
});

const emit = defineEmits(['file:rename']);
const { t } = useI18n();
const fileName = ref(props.file.label);
const submitting = ref(false);
const labels = ref([]);

/**
 * Emit original & new file and send positive toast.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function onSubmit() {
  if (fileName.value === props.file.label) {
    emit('file:rename');
    return Promise.resolve();
  }

  submitting.value = true;

  const newPath = props.file.id
    .slice(0, props.file.label.length * -1)
    .concat(fileName.value);

  return rename(`${props.projectName}/${props.file.id}`, `${props.projectName}/${newPath}`)
    .then(async () => {
      await gitRemove(props.projectName, props.file.id);

      emit('file:rename');

      Notify.create({
        type: 'positive',
        message: t(`actions.fileExplorer.${props.file.isFolder ? 'folder' : 'file'}.rename`),
        html: true,
      });

      FileEvent.RenameFileEvent.next({
        file: props.file,
        newFile: {
          ...props.file,
          id: newPath,
          label: fileName.value,
        },
      });
    }).catch(() => {
      Notify.create({
        type: 'negative',
        message: t(`errors.fileExplorer.default.${props.file.isFolder ? 'folder' : 'file'}.rename`),
        html: true,
      });
    }).finally(() => {
      submitting.value = false;
    });
}

/**
 * Init list of file labels to check the uniqueness before save.
 */
async function initLabels() {
  const parentPath = props.file.id
    .slice(0, props.file.label.length * -1);
  labels.value = (await readDir(`/${props.projectName}/${parentPath}`))
    .filter((lab) => lab !== props.file.label);
}

onMounted(async () => {
  await initLabels();
});
</script>

<style lang="scss">
.rename-file-form {
  min-width: 400px;
}
</style>
