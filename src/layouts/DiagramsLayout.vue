<template>
  <q-layout view="HHh Lpr Fff">
    <navigation-bar
      :project-name="projectName"
    />
    <q-page-container>
      <diagrams-page />
    </q-page-container>
    <git-authentication-dialog :project-name="projectName" />
    <git-add-remote-dialog :project-name="projectName" />
  </q-layout>
</template>

<script setup>
import NavigationBar from 'src/components/NavigationBar.vue';
import DiagramsPage from 'src/pages/DiagramsPage.vue';
import GitAuthenticationDialog from 'components/dialog/GitAuthenticationDialog.vue';
import GitAddRemoteDialog from 'components/dialog/GitAddRemoteDialog.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const projectName = computed(() => route.params.projectName);
</script>
