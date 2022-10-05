<template>
  <div class="monaco-editor"
    data-cy="monaco-editor"
  >
    <div id="container" ref="container"></div>
  </div>
</template>

<script setup>
import {
  onMounted,
  onUpdated,
  nextTick,
  ref,
  watch,
} from 'vue';

const monaco = require('monaco-editor');

// Need to be here, otherwise OnUpdated is not called.
const props = defineProps({
  viewType: {
    type: String,
    default: 'text',
  },
  content: {
    type: String,
    default: '',
  },
});

const container = ref(null);
let editor;

/**
 * Setup monaco editor.
 */
function createEditor() {
  editor = monaco.editor.create(container.value, {
    value: props.content,
    language: 'text',
  });
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

watch(() => props.content, () => {
  editor.setValue(props.content);
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
