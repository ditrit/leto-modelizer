<template>
  <default-dialog
    dialog-key="DeleteProject"
    data-cy="delete-project-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-folder-minus"
      />
      {{ $t('page.home.project.delete') }}
    </template>
    <template #default>
      <delete-project-form
        :project-id="projectId"
        @project:delete="DialogEvent.next({ type: 'close', key: 'DeleteProject' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'src/components/dialog/DefaultDialog.vue';
import DeleteProjectForm from 'src/components/form/DeleteProjectForm.vue';
import { onMounted, onUnmounted, ref } from 'vue';

const projectId = ref(null);
let dialogEventSubscription;

/**
 * Set projectId on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event key.
 * @param {object} event.id - Project id.
 */
function setProjectId({ key, id }) {
  if (key === 'DeleteProject') {
    projectId.value = id;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setProjectId);
});
onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
