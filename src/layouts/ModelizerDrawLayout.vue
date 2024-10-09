<template>
  <q-layout view="hHh lpR fFf">
    <navigation-bar :project-name="projectName" />

    <q-page-container>
      <modelizer-draw-page />
    </q-page-container>

    <console-footer editor-type="diagram" />

    <git-authentication-dialog :project-name="projectName" />
    <git-add-remote-dialog :project-name="projectName" />
    <component-menu-dialog dialog-key="ComponentMenu" />
    <delete-a-i-conversation-dialog />
  </q-layout>
</template>

<script setup>
import NavigationBar from 'components/NavigationBar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ConsoleFooter from 'components/drawer/ConsoleFooter.vue';
import ModelizerDrawPage from 'pages/ModelizerDrawPage.vue';
import DeleteAIConversationDialog from 'components/dialog/DeleteAIConversationDialog.vue';
import GitAuthenticationDialog from 'components/dialog/GitAuthenticationDialog.vue';
import GitAddRemoteDialog from 'components/dialog/GitAddRemoteDialog.vue';
import ComponentMenuDialog from 'components/dialog/ComponentMenuDialog.vue';

const route = useRoute();
const projectName = computed(() => route.params.projectName);
</script>
