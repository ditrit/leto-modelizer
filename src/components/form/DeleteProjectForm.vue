<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md delete-project-form"
    data-cy="delete-project-form"
  >
    <q-checkbox
      v-model="confirmDelete"
      :label="$t(
        'actions.home.deleteProject.confirmDelete',
        { name: props.projectId },
      )"
      data-cy="confirm-delete-checkbox"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        :label="$t('actions.home.deleteProject.title')"
        :loading="submitting"
        icon="fa-solid fa-trash"
        type="submit"
        :disable="!confirmDelete"
        color="negative"
        data-cy="submit-button"
      >
        <template v-slot:loading>
          <q-spinner-dots />
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { Notify } from 'quasar';
import { ref } from 'vue';
import { deleteProjectById } from 'src/composables/Project';
import { useI18n } from 'vue-i18n';
import ProjectEvent from 'src/composables/events/ProjectEvent';

const emit = defineEmits(['project:delete']);

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const confirmDelete = ref(false);
const submitting = ref(false);

/**
 * Delete project, manage toast and loader.
 */
function onSubmit() {
  submitting.value = true;

  return deleteProjectById(props.projectId)
    .then(() => {
      emit('project:delete');
      ProjectEvent.UpdateProjectEvent.next();
      Notify.create({
        type: 'positive',
        message: t('actions.home.deleteProject.success'),
        html: true,
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.projects.delete'),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
    });
}
</script>
