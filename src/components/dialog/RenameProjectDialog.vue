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
import DefaultDialog from 'src/components/dialog/DefaultDialog.vue';
import RenameProjectForm from 'src/components/form/RenameProjectForm.vue';
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
