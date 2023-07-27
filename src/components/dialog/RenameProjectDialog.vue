<template>
  <default-dialog
    dialog-key="RenameProject"
    data-cy="rename-project-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-pen"
      />
      {{ $t('page.home.project.rename') }}
    </template>
    <template #default>
      <rename-project-form
        :project-id="projectId"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'src/components/dialog/DefaultDialog';
import RenameProjectForm from 'src/components/form/RenameProjectForm';
import { onMounted, onUnmounted, ref } from 'vue';

const projectId = ref(null);
let dialogEventSubscription;

/**
 * Set projectId on valid event.
 * @param {string} key - Event key.
 * @param {object} id - Project id.
 */
function setProjectId({ key, id }) {
  if (key === 'RenameProject') {
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
