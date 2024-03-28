<template>
  <q-form
    class="q-gutter-md create-model-form"
    data-cy="create-ai-model-form"
    @submit="onSubmit"
  >
    <q-select
      v-model="modelPlugin"
      filled
      :label="$t('actions.models.create.form.plugin')"
      :options="plugins.map(({ data }) => data.name)"
      :rules="[
        (value) => notEmpty($t, value),
      ]"
      data-cy="plugin-select"
      @update:model-value="onPluginChange"
    >
      <template #option="{ selected, opt, toggleOption }">
        <q-item
          :active="selected"
          clickable
          @click="toggleOption(opt)"
        >
          <q-item-section :data-cy="`item_${opt}`">
            {{ opt }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      v-model="modelPath"
      filled
      :label="$t('actions.models.create.form.name')"
      lazy-rules
      :rules="[
        (value) => canCreateRootModel ? null : notEmpty($t, value),
        (value) => isUniqueModel(
          $t,
          modelPlugin,
          models.filter(({ plugin }) => plugin === modelPlugin).map(({ path }) => path),
          modelLocation,
          'errors.models.duplicate',
        ),
        () => isValidDiagramPath()
      ]"
      data-cy="name-input"
    />
    <q-input
      v-model="modelPath"
      :model-value="modelLocation"
      outlined
      disable
      :label="$t('actions.models.create.form.location')"
      data-cy="location-input"
    />
    <q-input
      v-model="modelDescription"
      filled
      type="textarea"
      :label="$t('actions.models.create.form.description')"
      lazy-rules
      :rules="[(value) => notEmpty($t, value)]"
      bottom-slots
      :error="modelDescriptionError"
      :error-message="modelDescriptionErrorMessage"
      data-cy="description-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-brain"
        :label="$t('actions.default.create')"
        type="submit"
        :loading="submitting"
        color="positive"
        data-cy="submit-button"
      >
        <template #loading>
          <q-spinner-bars class="q-mx-md" />
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { Notify } from 'quasar';
import { getPluginByName, getPlugins, getModelPath } from 'src/composables/PluginManager';
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { isUniqueModel, notEmpty } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import {
  appendProjectFile,
  getAllModels,
} from 'src/composables/Project';
import { useRouter } from 'vue-router';
import {
  FileInput,
  FileInformation,
} from '@ditrit/leto-modelizer-plugin-core';
import { generateDiagram } from 'src/services/AIService';

const { t } = useI18n();
const router = useRouter();

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const plugins = reactive(getPlugins());
const modelPath = ref();
const modelPlugin = ref(plugins[0]?.data.name);
const modelDescription = ref('');
const modelDescriptionError = ref(false);
const modelDescriptionErrorMessage = ref('');
const submitting = ref(false);
const models = ref([]);
const pluginConfiguration = computed(() => getPluginByName(modelPlugin.value).configuration);
const fileName = computed(() => pluginConfiguration.value.defaultFileName || '');
const baseFolder = computed(() => pluginConfiguration.value.restrictiveFolder || '');
const canCreateRootModel = computed(() => pluginConfiguration.value.restrictiveFolder === null);
const modelLocation = computed(() => {
  if (pluginConfiguration.value.isFolderTypeDiagram) {
    if (modelPath.value?.length > 0) {
      return `${baseFolder.value}${modelPath.value}/${fileName.value}`;
    }
    return `${baseFolder.value}${fileName.value}`;
  }

  return `${baseFolder.value}${modelPath.value}`;
});

/**
 * Check if new diagram to create has a valid path.
 * @returns {null | string} Return true if the value is a valid diagram path,
 * otherwise the translated error message.
 */
function isValidDiagramPath() {
  return getPluginByName(modelPlugin.value)
    .isParsable(new FileInformation({ path: modelLocation.value }))
    ? null : t('errors.models.notParsable');
}

/**
 * Create a new files with its parent folders if necessary, from the AI Proxy response.
 * The response contains the name and content of the new files.
 * They are then appended to the project.
 * @param {Array} files - List of files from AI Proxy response.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function createFilesFromAIResponse(files) {
  const model = getModelPath(modelPlugin.value, modelLocation.value);

  return Promise.allSettled(files.map((file) => {
    const path = (modelPath.value?.length > 0)
      ? `${props.projectName}/${baseFolder.value}${modelPath.value}/${file.name}`
      : `${props.projectName}/${baseFolder.value}${file.name}`;

    return appendProjectFile(new FileInput({
      path,
      content: file.content,
    }));
  }))
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('actions.models.create.notify.success'),
        html: true,
      });

      return router.push({
        name: 'Draw',
        params: {
          projectName: props.projectName,
        },
        query: {
          plugin: modelPlugin.value,
          path: model,
        },
      });
    });
}

/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit a negative notification.
 * @returns {Promise<void>} Promise with nothing on success or error.
 */
async function onSubmit() {
  submitting.value = true;
  modelDescriptionError.value = false;
  modelDescriptionErrorMessage.value = '';

  return generateDiagram(modelPlugin.value, modelDescription.value)
    .then(createFilesFromAIResponse)
    .catch(() => {
      modelDescriptionError.value = true;
      modelDescriptionErrorMessage.value = t('actions.models.create.button.ai.error');
    })
    .finally(() => {
      submitting.value = false;
    });
}

/**
 * Set model path on plugin name change.
 */
function onPluginChange() {
  const { defaultFileName = '', isFolderTypeDiagram } = pluginConfiguration.value;

  modelPath.value = isFolderTypeDiagram ? '' : defaultFileName;
}

onMounted(async () => {
  getAllModels(props.projectName).then((array) => {
    models.value = array;
  });
});
</script>

<style lang="scss" scoped>
.create-model-form {
  min-width: 300px;
}
</style>
