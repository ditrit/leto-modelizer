<template>
  <q-drawer
    v-model="isVisible"
    side="left"
  >
    <git-branch-card/>
    <q-checkbox
      v-model="showParsableFiles"
      class="q-ml-lg"
      left-label
      :label="$t('page.modelizer.fileExplorer.filterParsableFiles')"
    />
    <file-explorer
      class="q-px-md q-py-sm overflow-auto"
      :nodes="nodes"
      :project-name="projectName"
      :show-parsable-files="showParsableFiles"
    />
  </q-drawer>
</template>

<script setup>
import FileExplorer from 'components/FileExplorer.vue';
import GitBranchCard from 'components/card/GitBranchCard';
import {
  ref,
} from 'vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const isVisible = ref(true);
const nodes = ref([]);
const showParsableFiles = ref(false);
</script>
