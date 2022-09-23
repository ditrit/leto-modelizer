<template>
  <div class="modelizer-text-view row"
    data-cy="modelizer-text-view"
  >
    <file-explorer
      class="q-ma-md col-2 overflow-auto"
      :nodes="nodes"
    />
    <q-separator vertical inset />
    <monaco-editor :viewType="viewType" class="col-auto" />
  </div>
</template>

<script setup>
import { getTree } from 'src/composables/FileExplorer';
import MonacoEditor from 'components/editor/MonacoEditor.vue';
import FileExplorer from 'components/FileExplorer.vue';

defineProps({
  viewType: String,
});

// TODO : Remove Hard-coded data when link with git provider will be done
const fileInformation = [
  { path: '.gitignore' },
  { path: '/home/terraform/app.tf' },
  { path: '/home/terraform/user.tf' },
  { path: '/tests/example.spec.js' },
  { path: '/tests/unit/file3.tf' },
  { path: '/tests/unit/events.spec.js' },
  { path: 'README.md' },
  { path: '/home/file1.tf' },
  { path: '/home/file2.tf' },
];

const nodes = getTree(fileInformation);

</script>
