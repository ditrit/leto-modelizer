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
          template.plugins[0],
          models,
          `${baseFolder}${value || ''}${template.files[0]}`,
          'errors.models.duplicate',
        )
      ]"
      data-cy="name-input"
    />
    <div>
      <div
        v-for="file in template.files.filter((file) => file !== 'leto-modelizer.config.json')"
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
import { onMounted, ref, toRef } from 'vue';
import { isUniqueModel } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import {
  appendProjectFile,
  getAllModels,
  readProjectFile,
  writeProjectFile,
} from 'src/composables/Project';
import { useRouter } from 'vue-router';
import { FileInput } from '@ditrit/leto-modelizer-plugin-core';
import { getModelPath, getPluginByName } from 'src/composables/PluginManager';
import { getTemplateFiles } from 'src/services/TemplateService';

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
const template = toRef(props, 'template');
const plugin = ref(getPluginByName(template.value.plugins[0]));
const baseFolder = ref(getPluginByName(template.value.plugins[0]).configuration.restrictiveFolder || '');
const modelName = ref(plugin.value.getModels(
  template.value.files.map((file) => `${baseFolder.value || ''}${file}`),
)[0]);
const submitting = ref(false);
const models = ref([]);

/**
 * Init all models.
 */
async function initAllModels() {
  models.value = (await getAllModels(props.projectName))
    .filter((model) => model.plugin === props.template.plugin)
    .map(({ path }) => path);
}

/**
 * Add template config to global config.
 * @param {string} realModelName - Model name from plugin.
 * @param {string} content - Template config file content.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function manageConfigFile(realModelName, content) {
  const configPath = `${props.projectName}/leto-modelizer.config.json`;
  const originContent = await readProjectFile(
    { path: configPath },
  ).then((fileInput) => fileInput.content || '');

  let config = {};

  if (originContent !== '') {
    config = JSON.parse(originContent);
  }

  config[realModelName] = {
    ...config[realModelName],
    ...JSON.parse(content),
  };

  return writeProjectFile(
    new FileInput({
      path: configPath,
      content: JSON.stringify(config, null, 2),
    }),
  );
}

/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit a negative notification.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function onSubmit() {
  const model = getModelPath(
    props.template.plugins[0],
    `${baseFolder.value}${modelName.value || ''}${props.template.files[0]}`,
  );
  const files = await getTemplateFiles({
    HAS_BACKEND: process.env.HAS_BACKEND,
    TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
  }, props.template);

  return Promise.allSettled(files.map((file) => {
    if (file.path.indexOf('leto-modelizer.config.json') !== -1) {
      return manageConfigFile(model, file.content);
    }
    file.path = `${props.projectName}/${baseFolder.value}${modelName.value || ''}${file.path}`;

    return appendProjectFile(file);
  }))
    .then(() => {
      submitting.value = false;
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
          plugin: props.template.plugins[0],
          path: model,
        },
      });
    });
}

onMounted(() => {
  initAllModels();
});
</script>
