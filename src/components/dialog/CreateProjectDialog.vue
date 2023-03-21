<template>
  <default-dialog
    dialog-key="CreateProject"
    data-cy="create-project-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-square-plus"
      />
      {{ $t(`page.home.project.create`) }}
    </template>
    <template #default>
      <create-project-form
        @project:create="createProject"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'src/components/dialog/DefaultDialog';
import CreateProjectForm from 'src/components/form/CreateProjectForm';
import { useRouter } from 'vue-router';
import { initProject } from 'src/composables/Project';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

/**
 * Create project on fs, init project on git,
 * close CreateProject and redirect to project page.
 * Manage notification.
 */
async function createProject(projectId) {
  const project = { id: projectId };

  await initProject(project).then(() => {
    DialogEvent.next({ type: 'close', key: 'CreateProject' });
    router.push(`/modelizer/${projectId}/models`);
    Notify.create({
      type: 'positive',
      message: t('actions.home.createdProject'),
      html: true,
    });
  }).catch(() => {
    Notify.create({
      type: 'warning',
      message: t('errors.projects.create'),
      html: true,
    });
  });
}
</script>
