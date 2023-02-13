<template>
  <default-dialog
    dialog-key="CreateModel"
    data-cy="create-model-dialog"
  >
    <template v-slot:title>
      <q-icon
        color="primary"
        name="fa-solid fa-scroll"
      />
      {{ $t(`actions.models.create.dialog.name`) }}
    </template>
    <template v-slot:default>
      <create-model-form
        :project-name="projectName"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog';
import CreateModelForm from 'components/form/CreateModelForm.vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
</script>
