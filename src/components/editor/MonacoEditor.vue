<template>
  <div class="monaco-editor"
    data-cy="monaco-editor"
  >
    <div id="container" ref="container"></div>
  </div>
</template>

<script setup>
import {
  writeProjectFile,
  readProjectFile,
} from 'src/composables/Project';
import {
  onMounted,
  onUpdated,
  onUnmounted,
  nextTick,
  ref,
} from 'vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';

const monaco = require('monaco-editor');

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  file: {
    type: Object,
    require: true,
  },
});

const container = ref(null);
let editor;
let checkoutSubscription;
let addRemoteSubscription;
let pullSubscription;
let updateFileContentSubsciption;

/**
 * Update file content on fs and emit an event.
 */
async function updateFile() {
  const file = {
    ...props.file,
    path: props.file.id,
    content: editor.getValue(),
  };

  await writeProjectFile(props.projectName, file);
  FileEvent.UpdateEditorContentEvent.next(file.id);
}

function getFileContent() {
  return readProjectFile(props.projectName, { path: props.file.id })
    .then((fileInput) => fileInput.content);
}

/**
 * Setup monaco editor.
 */
async function createEditor() {
  // TODO : add loader
  const value = await getFileContent();
  editor = monaco.editor.create(container.value, {
    value,
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

async function updateEditorContent() {
  const value = await getFileContent();

  editor.setValue(value);
}

onMounted(() => {
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(updateEditorContent);
  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(updateEditorContent);
  pullSubscription = GitEvent.PullEvent.subscribe(updateEditorContent);
  updateFileContentSubsciption = FileEvent.UpdateFileContentEvent.subscribe(updateEditorContent);

  nextTick(createEditor);
});

onUpdated(() => {
  nextTick(updateEditorLayout);
});

onUnmounted(() => {
  checkoutSubscription.unsubscribe();
  addRemoteSubscription.unsubscribe();
  pullSubscription.unsubscribe();
  updateFileContentSubsciption.unsubscribe();
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
