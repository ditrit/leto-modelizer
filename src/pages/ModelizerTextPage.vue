<template>
  <q-page>
    <file-tabs
      :project-name="projectName"
    >
      <template #default="{ file }">
        <monaco-editor
          :file="file"
          :project-name="projectName"
        />
      </template>
    </file-tabs>
  </q-page>
</template>

<script setup>
import MonacoEditor from 'components/editor/MonacoEditor.vue';
import FileTabs from 'components/tab/FileTabs.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const projectName = computed(() => route.params.projectName);
</script>
