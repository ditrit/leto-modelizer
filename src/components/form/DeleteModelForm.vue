<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md delete-model-form"
    data-cy="delete-model-form"
  >
    <div class="flex row items-center justify-center">
      {{$t('actions.models.delete.form.message')}}
    </div>
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-trash"
        :label="$t('actions.default.delete')"
        type="submit"
        :loading="submitting"
        color="negative"
        data-cy="submit-button"
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
import DialogEvent from 'src/composables/events/DialogEvent';
import { deleteProjectDir } from 'src/composables/Project';
import { ref } from 'vue';
import UpdateModelEvent from 'src/composables/events/ModelEvent';
import { useI18n } from 'vue-i18n';

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

const submitting = ref(false);

/**
 * Delete model (folder).
 * Emit a positive notification on success and emit an UpdateModel event.
 * Otherwise, emit an error notification.
 * @return {Promise<void>} Promise with nothing on success or error.
 */
async function onSubmit() {
  submitting.value = true;
  const pluginFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${props.projectName}/${process.env.MODELS_DEFAULT_FOLDER}/${props.model.plugin}`
    : `${props.projectName}/${props.model.plugin}`;

  return deleteProjectDir(`${pluginFolder}/${props.model.name}`)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('actions.models.delete.notify.success'),
        html: true,
      });
      DialogEvent.next({ type: 'close', key: 'DeleteModel' });
      UpdateModelEvent.next();
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('actions.models.delete.notify.error'),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
    });
}
</script>
