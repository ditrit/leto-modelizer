<template>
  <div class="monaco-editor"
    data-cy="monaco-editor"
  >
    <div id="container" ref="container"></div>
  </div>
</template>

<script setup>
import { writeProjectFile } from 'src/composables/Project';
import {
  onMounted,
  onUpdated,
  nextTick,
  ref,
  watch,
} from 'vue';
import FileEvent from 'src/composables/events/FileEvent';

const monaco = require('monaco-editor');

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  fileInput: {
    type: Object,
    require: true,
  },
});

const container = ref(null);
let editor;

/**
 * Update file content on fs and emit an event.
 */
async function updateFile() {
  const file = { ...props.fileInput, content: editor.getValue() };
  file.path = file.id;
  await writeProjectFile(props.projectName, file);
  FileEvent.UpdateFileEvent.next(props.fileInput.id);
}

/**
 * Setup monaco editor.
 */
function createEditor() {
  editor = monaco.editor.create(container.value, {
    value: props.fileInput.content,
    language: 'text',
  });
  editor.onDidChangeModelContent(updateFile);
}

/**
 * Update default editor layout size.
 * Needed when viewType is firstly set to 'model' and ModelizerTextView is hidden,
 * meaning 'container' height and width are set to 0.
 */
function updateEditorLayout() {
  editor.layout({
    height: container.value.offsetHeight,
    width: container.value.offsetWidth,
  });
}

watch(() => props.fileInput.content, () => {
  editor.setValue(props.fileInput.content);
});

onMounted(() => {
  nextTick(createEditor);
});

onUpdated(() => {
  nextTick(updateEditorLayout);
});
</script>

<style lang="scss" scoped>
.monaco-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 1.5rem;
  height: 100vh;

  #container {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>
