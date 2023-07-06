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
      <div class="row justify-center q-my-sm">
        <q-btn
          :label="$t('page.modelizer.button.back.label')"
          :title="$t('page.modelizer.button.back.title')"
          color="positive"
          class="q-mr-md"
          no-caps
          data-cy="models-page-link-button"
          @click="router.push(`/projects/${projectName}/models`)"
        />
      </div>
      <git-branch-card />
      <q-checkbox
        v-model="showParsableFiles"
        class="q-ml-lg"
        left-label
        :label="$t('page.modelizer.fileExplorer.filterParsableFiles')"
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
import GitBranchCard from 'src/components/card/GitBranchCard';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const projectName = computed(() => route.params.projectName);
const drawer = ref(true);
const showParsableFiles = ref(false);
</script>
