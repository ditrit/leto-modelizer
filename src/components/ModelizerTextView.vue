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
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import FileEvent from 'src/composables/events/FileEvent';
import { getAllModels } from 'src/composables/Project';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const query = computed(() => route.query);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const showParsableFiles = ref(false);

let selectFileTabSubscription;

/**
 * Get model corresponding to the selected file tab.
 * @param {String} selectedFileTabPath - Path of the selected file tab.
 * @return {Promise<Object>} Promise with the model or undefined on success otherwise an error.
 */
async function getModel(selectedFileTabPath) {
  if (!selectedFileTabPath) {
    return undefined;
  }

  const models = await getAllModels(props.projectName);
  const defaultFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/`
    : '';

  return models.find(
    ({ name, plugin }) => selectedFileTabPath.startsWith(`${defaultFolder}${plugin}/${name}/`),
  );
}

/**
 * Update the path of the query if necessary.
 * @param {String} event - Path of the selected file tab.
 * @return {Promise<Object>} Promise with nothing on success otherwise an error.
 */
async function onSelectFileTab(event) {
  if (event && !event.startsWith(`${query.value.path}/`)) {
    const model = await getModel(event);
    const modelPath = model ? `${model.plugin}/${model.name}` : query.value.path;

    await router.push({
      name: 'modelizer',
      params: {
        viewType: 'text',
        projectName: props.projectName,
      },
      query: {
        path: modelPath,
      },
    });
  }
}

onMounted(() => {
  selectFileTabSubscription = FileEvent.SelectFileTabEvent.subscribe(onSelectFileTab);
});

onUnmounted(() => {
  selectFileTabSubscription.unsubscribe();
});
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
