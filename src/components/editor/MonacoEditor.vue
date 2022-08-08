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
} from 'vue';

const monaco = require('monaco-editor');

// Need to be here, otherwise OnUpdated is not called.
defineProps({
  viewType: String,
});

const container = ref(null);
let editor;

/**
 * Setup monaco editor.
 */
function createEditor() {
  editor = monaco.editor.create(container.value, {
    value: '',
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
