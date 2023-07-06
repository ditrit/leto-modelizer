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
        (value) => isUniqueModel(
          $t,
          template.plugin,
          models,
          `${baseFolder}${value || ''}${template.files[0]}`,
          'errors.models.duplicate',
        )
      ]"
      data-cy="name-input"
    />
    <div>
      <div
        v-for="file in template.files"
        :key="file"
      >
        {{ baseFolder }}{{ modelName }}{{ file }}
      </div>
    </div>
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
import { onMounted, ref, watch } from 'vue';
import { isUniqueModel } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import {
  appendProjectFile,
  getAllModels,
} from 'src/composables/Project';
import { useRouter } from 'vue-router';
import { FileInput } from 'leto-modelizer-plugin-core';
import { getTemplateFileByPath } from 'src/composables/TemplateManager';
import { getModelPath, getPluginByName } from 'src/composables/PluginManager';

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
const plugin = ref(getPluginByName(props.template.plugin));
const baseFolder = ref(getPluginByName(props.template.plugin).configuration.restrictiveFolder || '');
const modelName = ref(plugin.value
  .getModels(props.template.files
    .map((file) => `${baseFolder.value || ''}${file}`))[0]);
const submitting = ref(false);
const models = ref([]);

async function initAllModels() {
  models.value = (await getAllModels(props.projectName))
    .filter((model) => model.plugin === props.template.plugin)
    .map(({ path }) => path);
}
/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit a negative notification.
 */
async function onSubmit() {
  const model = getModelPath(
    props.template.plugin,
    `${baseFolder.value}${modelName.value}${props.template.files[0]}`,
  );

  return Promise.allSettled(props.template.files
    .map((file) => getTemplateFileByPath(`templates/${props.template.key}/${file}`, 'text')
      .then((result) => appendProjectFile(props.projectName, new FileInput({
        path: `${baseFolder.value}${modelName.value}${file}`,
        content: result.data,
      })))
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('errors.templates.getData'),
          html: true,
        });
      })))
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('actions.models.import.notify.success'),
        html: true,
      });

      return router.push({
        name: 'Draw',
        params: {
          projectName: props.projectName,
        },
        query: {
          plugin: props.template.plugin,
          path: model,
        },
      });
    })
    .finally(() => {
      submitting.value = false;
    });
}

watch(() => props.projectName, () => async () => {
  await initAllModels();
});

onMounted(() => {
  initAllModels();
});
</script>
