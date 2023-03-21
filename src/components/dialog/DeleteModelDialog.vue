<template>
  <default-dialog
    dialog-key="DeleteModel"
    data-cy="delete-model-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-scroll"
      />
      {{ $t(`actions.models.delete.dialog.name`) }}
    </template>
    <template #default>
      <delete-model-form
        :project-name="projectName"
        :model="deletedModel"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog';
import DeleteModelForm from 'components/form/DeleteModelForm.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const deletedModel = ref(null);

let dialogEventSubscription;

/**
 * Set deleted model name on valid event.
 * @param {String} key - Event type.
 * @param {String} model - Name of the model to delete.
 */
function setDeletedModel({ key, model }) {
  if (key === 'DeleteModel') {
    deletedModel.value = model;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setDeletedModel);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
