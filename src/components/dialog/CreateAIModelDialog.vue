<template>
  <default-dialog
    dialog-key="CreateAIModel"
    data-cy="create-ai-model-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-scroll"
      />
      {{ $t(`actions.models.create.dialog.name`) }}
    </template>
    <template #default>
      <create-a-i-model-form
        :project-name="projectName"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import CreateAIModelForm from 'components/form/CreateAIModelForm.vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
</script>
