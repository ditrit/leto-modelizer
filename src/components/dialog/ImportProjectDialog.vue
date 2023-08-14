<template>
  <default-dialog
    dialog-key="ImportProject"
    data-cy="import-project-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-brands fa-git-alt"
      />
      {{ $t('page.home.project.import') }}
    </template>
    <template #default>
      <import-project-form
        @project:import="importProject"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'src/components/dialog/DefaultDialog';
import ImportProjectForm from 'src/components/form/ImportProjectForm';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Close importProjectDialog and redirect to project model page.
 * @param {string} projectId - Id of project.
 */
async function importProject(projectId) {
  DialogEvent.next({ type: 'close', key: 'ImportProject' });
  await router.push(`/projects/${projectId}/models`);
}
</script>
