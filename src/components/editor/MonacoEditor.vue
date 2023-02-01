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
 * Update file content on fs and emit UpdateEditorContentEvent.
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

/**
 * Read file on fs to get its content.
 * @return {Promise<String>} Promise with file's content on success otherwise error.
 */
async function getFileContent() {
  return readProjectFile(props.projectName, { path: props.file.id })
    .then((fileInput) => fileInput.content);
}

/**
 * Setup monaco editor.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function createEditor() {
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

/**
 * Get file content and update editor value.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
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
  //132px is the combined navbar + file tabs height
  height: calc(100vh - 132px - 1.5rem);

  #container {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>
