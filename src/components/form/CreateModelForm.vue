<template>
  <q-form
    class="q-gutter-md create-model-form"
    data-cy="create-model-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="modelName"
      filled
      :label="$t('actions.models.create.form.name')"
      lazy-rules
      :rules="[
        (value) => notEmpty($t, value),
        (value) => isUnique(
          $t,
          models.map((model) => `${model.plugin}/${model.name}`),
          `${modelPlugin}/${value}`,
          'errors.models.duplicate',
        )
      ]"
      data-cy="name-input"
    />
    <q-select
      v-model="modelPlugin"
      filled
      :label="$t('actions.models.create.form.plugin')"
      :options="plugins.map(({ data }) => data.name)"
      :rules="[
        (value) => notEmpty($t, value),
      ]"
      data-cy="plugin-select"
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
import { getPlugins } from 'src/composables/PluginManager';
import { onMounted, reactive, ref } from 'vue';
import { isUnique, notEmpty } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import { createProjectFolder, getAllModels } from 'src/composables/Project';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const plugins = reactive(getPlugins());
const modelName = ref(null);
const modelPlugin = ref(plugins[0]?.data.name);
const submitting = ref(false);
const models = ref([]);

/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit a negative notification.
 * @return {Promise<void>} Promise with nothing on success or error.
 */
async function onSubmit() {
  const pluginFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/${modelPlugin.value}`
    : `${modelPlugin.value}`;

  return createProjectFolder(props.projectName, `${pluginFolder}/${modelName.value}`)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('actions.models.create.notify.success'),
        html: true,
      });

      return router.push({
        name: 'modelizer',
        params: {
          viewType: 'draw',
          projectName: props.projectName,
        },
        query: { path: `${modelPlugin.value}/${modelName.value}` },
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

onMounted(() => {
  getAllModels(props.projectName).then((array) => {
    models.value = array;
  });
});
</script>
