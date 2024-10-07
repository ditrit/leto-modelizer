<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    bordered
    side="left"
    class="bg-grey-2"
    data-cy="modelizer-text-left-drawer"
  >
    <div class="col-md-2 bg-grey-2 file-explorer-container">
      <project-details-list level="2" />
      <git-branch-card />
      <q-checkbox
        v-model="showParsableFiles"
        class="q-ml-lg"
        left-label
        :label="$t('page.modelizer.fileExplorer.filterParsableFiles')"
        data-cy="show-parsable-files-checkbox"
      />
      <file-explorer
        class="q-px-md q-py-sm overflow-auto"
        :project-name="projectName"
        :show-parsable-files="showParsableFiles"
      />
    </div>
  </q-drawer>
</template>

<script setup>
import FileExplorer from 'src/components/FileExplorer.vue';
import GitBranchCard from 'src/components/card/GitBranchCard.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProjectDetailsList from 'components/list/ProjectDetailsList.vue';

const route = useRoute();

const projectName = computed(() => route.params.projectName);
const drawer = ref(true);
const showParsableFiles = ref(false);
</script>
