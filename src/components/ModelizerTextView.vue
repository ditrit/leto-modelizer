<template>
  <div
    class="modelizer-text-view row"
    data-cy="modelizer-text-view"
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
          @click="router.push(`/${projectName}/models`)"
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

    <q-separator vertical />
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
  </div>
</template>

<script setup>
import MonacoEditor from 'components/editor/MonacoEditor.vue';
import FileExplorer from 'components/FileExplorer.vue';
import GitBranchCard from 'components/card/GitBranchCard';
import FileTabs from 'components/tab/FileTabs.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const showParsableFiles = ref(false);
</script>

<style lang="scss" scoped>
.modelizer-text-view {
 // set min-height to full height excluding header height
 // 74px = height of header
  height: calc(100vh - 74px)
}
.file-explorer-container {
  min-width: 200px;
}
</style>
