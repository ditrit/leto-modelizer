<template>
  <q-layout view="HHr Lpr fFr">
    <navigation-bar :project-name="projectName" />
    <q-page-container
      class="bg-grey-2"
    >
      <models-page />
    </q-page-container>
    <git-authentication-dialog :project-name="projectName" />
    <git-add-remote-dialog :project-name="projectName" />
  </q-layout>
</template>

<script setup>
import NavigationBar from 'components/NavigationBar.vue';
import ModelsPage from 'src/pages/ModelsPage.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import GitAuthenticationDialog from 'components/dialog/GitAuthenticationDialog.vue';
import GitAddRemoteDialog from 'components/dialog/GitAddRemoteDialog.vue';

const route = useRoute();
const projectName = computed(() => route.params.projectName);
</script>

<style scoped lang="scss">
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2001;
}
</style>

<style lang="scss">
.q-drawer:has(.create-diagram-drawer) {
  width: 43.75% !important;
}
</style>
