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
const template = toRef(props, 'template');
const plugin = ref(getPluginByName(template.value.plugin));
const baseFolder = ref(getPluginByName(template.value.plugin).configuration.restrictiveFolder || '');
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
  const originContent = await readProjectFile(
    props.projectName,
    { path: 'leto-modelizer.config.json' },
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
    props.projectName,
    new FileInput({
      path: 'leto-modelizer.config.json',
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
    props.template.plugin,
    `${baseFolder.value}${modelName.value || ''}${props.template.files[0]}`,
  );

  return Promise.allSettled(props.template.files.map(
    (file) => getTemplateFileByPath(
      `templates/${props.template.key}/${file}`,
      'text',
    )
      .then((result) => {
        if (file === 'leto-modelizer.config.json') {
          return manageConfigFile(model, result.data);
        }

        return appendProjectFile(
          props.projectName,
          new FileInput({
            path: `${baseFolder.value}${modelName.value || ''}${file}`,
            content: result.data,
          }),
        );
      })
      .catch(() => {
        Notify.create({
          type: 'negative',
          message: t('errors.templates.getData'),
          html: true,
        });
      }),
  ))
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
          plugin: props.template.plugin,
          path: model,
        },
      });
    });
}

onMounted(() => {
  initAllModels();
});
</script>
