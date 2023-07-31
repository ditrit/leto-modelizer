<template>
  <q-form
    class="q-gutter-md rename-project-form"
    data-cy="rename-project-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="projectName"
      :label="$t('page.home.project.name')"
      :rules="[
        (value) => notEmpty($t, value),
        (value) => isUnique(
          $t,
          Object.keys(getProjects()),
          value,
          'errors.projects.duplicate.name',
        ),
      ]"
      filled
      lazy-rules
      data-cy="name-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        :label="$t('actions.home.renameProject.title')"
        :loading="submitting"
        icon="fa-solid fa-save"
        type="submit"
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
import { ref, toRef } from 'vue';
import { notEmpty, isUnique } from 'src/composables/QuasarFieldRule';
import { renameProject, getProjects } from 'src/composables/Project';
import { useI18n } from 'vue-i18n';
import ProjectEvent from 'src/composables/events/ProjectEvent';
import DialogEvent from 'src/composables/events/DialogEvent';

const { t } = useI18n();
const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const projectName = ref(toRef(props, 'projectId').value);
const submitting = ref(false);

/**
 * Rename project, manage toast and loader.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function onSubmit() {
  submitting.value = true;

  return renameProject(props.projectId, projectName.value)
    .then(() => {
      DialogEvent.next({ type: 'close', key: 'RenameProject' });
      ProjectEvent.UpdateProjectEvent.next();
      Notify.create({
        type: 'positive',
        message: t('actions.home.renameProject.success'),
        html: true,
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.renameProject'),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
    });
}
</script>

<style lang="scss" scoped>
.rename-project-form {
  min-width: 400px;
}
</style>
