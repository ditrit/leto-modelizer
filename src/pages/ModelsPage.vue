<template>
  <q-layout
    class="models-page column"
    data-cy="models-page"
  >
    <navigation-bar
      :project-name="projectName"
    />
    <q-page-container>
      <q-page>
        <models-view
          :project-name="projectName"
        />

        <git-authentication-dialog :project-name="projectName" />
        <create-model-dialog :project-name="projectName" />
        <delete-model-dialog :project-name="projectName" />
        <rename-model-dialog :project-name="projectName" />
        <import-model-template-dialog :project-name="projectName" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavigationBar from 'src/components/NavigationBar';
import ModelsView from 'src/components/ModelsView';
import GitAuthenticationDialog from 'components/dialog/GitAuthenticationDialog';
import CreateModelDialog from 'components/dialog/CreateModelDialog';
import DeleteModelDialog from 'components/dialog/DeleteModelDialog';
import RenameModelDialog from 'components/dialog/RenameModelDialog';
import ImportModelTemplateDialog from 'components/dialog/ImportModelTemplateDialog';

const route = useRoute();
const projectName = computed(() => route.params.projectName);
</script>

<style scoped>
.q-layout.models-page>.q-page-container {
  padding-top: 0 !important;
}
</style>
