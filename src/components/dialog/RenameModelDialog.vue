<template>
  <default-dialog
    dialog-key="RenameModel"
    data-cy="rename-model-dialog"
  >
    <template v-slot:title>
      <q-icon
        color="primary"
        name="fa-solid fa-scroll"
      />
      {{ $t(`actions.models.rename.dialog.name`) }}
    </template>
    <template v-slot:default>
      <rename-model-form
        :project-name="projectName"
        :model="renamedModel"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog';
import RenameModelForm from 'components/form/RenameModelForm.vue';
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

const renamedModel = ref(null);

let dialogEventSubscription;

/**
 * Set renamed model name on valid event.
 * @param {String} key - Event type.
 * @param {String} model - Name of the model to rename.
 */
function setRenamedModel({ key, model }) {
  if (key === 'RenameModel') {
    renamedModel.value = model;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setRenamedModel);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
