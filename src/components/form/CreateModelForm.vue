<template>
  <q-form
    class="q-gutter-md create-model-form"
    data-cy="create-model-form"
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
      v-model="modelName"
      filled
      :label="$t('actions.models.create.form.name')"
      lazy-rules
      :rules="[
        (value) => notEmpty($t, value),
        (value) => isUniqueModel(
          $t,
          modelPlugin,
          models.filter(({ plugin }) => plugin === modelPlugin).map(({ path }) => path),
          `${baseFolder}${modelName}`,
          'errors.models.duplicate',
        )
      ]"
      data-cy="name-input"
    />
    <q-input
      v-model="modelName"
      :model-value="`${baseFolder}${modelName}`"
      outlined
      disable
      :label="$t('actions.models.create.form.location')"
      data-cy="location-input"
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
import { getPluginByName, getPlugins } from 'src/composables/PluginManager';
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
  getProjectFolders,
} from 'src/composables/Project';
import { useRouter } from 'vue-router';
import { FileInformation, FileInput } from 'leto-modelizer-plugin-core';

const { t } = useI18n();
const router = useRouter();

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const plugins = reactive(getPlugins());
const modelName = ref(plugins[0].configuration.defaultFileName);
const modelPlugin = ref(plugins[0]?.data.name);
const submitting = ref(false);
const models = ref([]);
const allFolders = ref([]);
const baseFolder = computed(() => getPluginByName(modelPlugin.value).configuration.restrictiveFolder || '');

/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit a negative notification.
 * @returns {Promise<void>} Promise with nothing on success or error.
 */
async function onSubmit() {
  const diagram = `${baseFolder.value}${modelName.value || ''}`;
  const model = getPluginByName(modelPlugin.value)
    .getModels([new FileInformation({ path: diagram })])
    .find(() => true);

  return appendProjectFile(
    props.projectName,
    new FileInput({ path: diagram, content: '' }),
  )
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
    })
    .catch((error) => {
      if (error?.name === 'EEXIST') {
        Notify.create({
          type: 'negative',
          message: t('actions.models.create.notify.eexist'),
          html: true,
        });
      } else {
        Notify.create({
          type: 'negative',
          message: t('actions.models.create.notify.error'),
          html: true,
        });
      }
    }).finally(() => {
      submitting.value = false;
    });
}

/**
 * Set default model name on plugin name change.
 */
function onPluginChange() {
  modelName.value = getPluginByName(modelPlugin.value).configuration.defaultFileName;
}

onMounted(async () => {
  getAllModels(props.projectName).then((array) => {
    models.value = array;
  });
  allFolders.value = await getProjectFolders(props.projectName);
});
</script>
