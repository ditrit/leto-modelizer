<template>
  <q-page>
    <models-view
      :project-name="projectName"
    />

    <create-model-dialog :project-name="projectName" />
    <delete-model-dialog :project-name="projectName" />
    <rename-model-dialog :project-name="projectName" />
    <import-model-template-dialog :project-name="projectName" />
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ModelsView from 'src/components/ModelsView.vue';
import CreateModelDialog from 'components/dialog/CreateModelDialog.vue';
import DeleteModelDialog from 'components/dialog/DeleteModelDialog.vue';
import RenameModelDialog from 'components/dialog/RenameModelDialog.vue';
import ImportModelTemplateDialog from 'components/dialog/ImportModelTemplateDialog.vue';

const route = useRoute();
const projectName = computed(() => route.params.projectName);
</script>
