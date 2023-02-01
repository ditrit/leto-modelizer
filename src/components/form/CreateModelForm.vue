<template>
  <q-form
    @submit="onSubmit"
    data-cy="create-model-form"
    class="q-gutter-md create-model-form"
  >
    <q-input
      v-model="modelName"
      filled
      :label="$t('actions.models.create.form.name')"
      lazy-rules
      data-cy="create-model-name-input"
      :rules="[
        (v) => notEmpty($t, v),
      ]"
    />
    <q-select
      filled
      v-model="modelPlugin"
      :label="$t('actions.models.create.form.plugin')"
      :options="plugins.map(({ data }) => data.name)"
      :rules="[
        (v) => notEmpty($t, v),
      ]"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.save')"
        type="submit"
        :loading="submitting"
        data-cy="create-model-submit"
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
import { getPlugins } from 'src/composables/PluginManager';
import { reactive, ref } from 'vue';
import { notEmpty } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import { createProjectFolder } from 'src/composables/Project';
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
const modelPlugin = ref(null);
const submitting = ref(false);

/**
 * Create a new model folder and its parent folders if necessary.
 * Emit a positive notification on success and redirect to model page.
 * Otherwise, emit an negative notification.
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

      router.push({
        name: 'modelizer',
        params: {
          viewType: 'model',
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
</script>
