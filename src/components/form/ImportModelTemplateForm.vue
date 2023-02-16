<template>
  <q-form
    class="q-gutter-md import-model-template-form"
    data-cy="import-model-template-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="modelName"
      filled
      :label="$t('actions.models.import.form.name')"
      lazy-rules
      :rules="[
        (v) => notEmpty($t, v),
        v => isUniqueModel($t, models, template.plugin, v)
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
import { onMounted, ref } from 'vue';
import { isUniqueModel, notEmpty } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import {
  createProjectFolder,
  appendProjectFile,
  getAllModels,
} from 'src/composables/Project';
import { useRouter } from 'vue-router';
import { FileInput } from 'leto-modelizer-plugin-core';
import { getTemplateFileByPath } from 'src/composables/TemplateManager';

const { t } = useI18n();
const router = useRouter();
const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  template: {
    type: Object,
    required: true,
  },
});
const modelName = ref(null);
const submitting = ref(false);
const models = ref([]);

/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit a negative notification.
 */
async function onSubmit() {
  const pluginFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/${props.template.plugin}`
    : `${props.template.plugin}`;

  return createProjectFolder(props.projectName, `${pluginFolder}/${modelName.value}`)
    .then(async () => Promise.allSettled(props.template.files
      .map((file) => getTemplateFileByPath(`templates/${props.template.key}/${file}`, 'text')
        .then((result) => appendProjectFile(props.projectName, new FileInput({
          path: `${pluginFolder}/${modelName.value}/${file}`,
          content: result.data,
        })))
        .catch(() => {
          Notify.create({
            type: 'negative',
            message: t('errors.templates.getData'),
            html: true,
          });
        }))))
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('actions.models.import.notify.success'),
        html: true,
      });

      router.push({
        name: 'modelizer',
        params: {
          viewType: 'draw',
          projectName: props.projectName,
        },
        query: { path: `${props.template.plugin}/${modelName.value}` },
      });
    })
    .catch((error) => {
      if (error?.name === 'EEXIST') {
        Notify.create({
          type: 'negative',
          message: t('actions.models.import.notify.eexist'),
          html: true,
        });
      } else {
        Notify.create({
          type: 'negative',
          message: t('actions.models.import.notify.error'),
          html: true,
        });
      }
    })
    .finally(() => {
      submitting.value = false;
    });
}

onMounted(() => {
  getAllModels(props.projectName).then((array) => {
    models.value = array;
  });
});
</script>
