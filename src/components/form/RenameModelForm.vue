<template>
  <q-form
    @submit="onSubmit"
    data-cy="rename-model-form"
    class="q-gutter-md rename-model-form"
  >
    <q-input
      v-model="modelName"
      filled
      :label="$t('actions.models.rename.form.name')"
      lazy-rules
      data-cy="name-input"
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
        data-cy="submit-button"
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
import { ref } from 'vue';
import { notEmpty } from 'src/composables/QuasarFieldRule';
import { useI18n } from 'vue-i18n';
import { rename } from 'src/composables/Project';
import DialogEvent from 'src/composables/events/DialogEvent';
import UpdateModelEvent from 'src/composables/events/ModelEvent';

const { t } = useI18n();

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  model: {
    type: Object,
    required: true,
  },
});

const modelName = ref(props.model.name);
const submitting = ref(false);

/**
 * Rename model (folder).
 * Emit a positive notification on success and emit an UpdateModel event.
 * Otherwise, emit an error notification.
 * @return {Promise<void>} Promise with nothing on success or error.
 */
async function onSubmit() {
  submitting.value = true;

  const pluginFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${props.projectName}/${process.env.MODELS_DEFAULT_FOLDER}/${props.model.plugin}`
    : `${props.projectName}/${props.model.plugin}`;

  return rename(
    `${pluginFolder}/${props.model.name}`,
    `${pluginFolder}/${modelName.value}`,
  ).then(() => {
    Notify.create({
      type: 'positive',
      message: t('actions.models.rename.notify.success'),
      html: true,
    });
    DialogEvent.next({ type: 'close', key: 'RenameModel' });
    UpdateModelEvent.next();
  }).catch((error) => {
    if (error?.code === 'EPERM') {
      Notify.create({
        type: 'negative',
        message: t('actions.models.rename.notify.eperm'),
        html: true,
      });
    } else {
      Notify.create({
        type: 'negative',
        message: t('actions.models.rename.notify.error'),
        html: true,
      });
    }
  }).finally(() => {
    submitting.value = false;
  });
}
</script>
