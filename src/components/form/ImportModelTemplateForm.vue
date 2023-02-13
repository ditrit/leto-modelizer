<template>
  <q-form
    class="q-gutter-md import-model-template-form"
    @submit="onSubmit"
    data-cy="import-model-template-form"
  >
    <q-input
      v-model="modelName"
      filled
      :label="$t('actions.models.import.form.name')"
      lazy-rules
      :rules="[
        (v) => notEmpty($t, v),
      ]"
      data-cy="import-model-template-name-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.save')"
        type="submit"
        :loading="submitting"
        color="positive"
        data-cy="import-model-template-submit"
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
import { ref } from 'vue';
import { notEmpty } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import {
  createProjectFolder,
  appendProjectFile,
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

/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit an negative notification.
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
          viewType: 'model',
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
</script>
