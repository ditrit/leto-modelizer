<template>
  <default-dialog
    dialog-key="CreateIAModel"
    data-cy="create-ia-model-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-scroll"
      />
      {{ $t(`actions.models.create.dialog.name`) }}
    </template>
    <template #default>
      <create-ia-model-form
        :project-name="projectName"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import CreateIaModelForm from 'components/form/CreateIAModelForm.vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
</script>
