<template>
  <div class="modelizer-text-view"
    data-cy="modelizer-text-view"
  >
    <monaco-editor :viewType="viewType"/>
  </div>
</template>

<script setup>
import MonacoEditor from 'components/editor/MonacoEditor.vue';

defineProps({
  viewType: String,
});
</script>

<style lang="scss" scoped>
.modelizer-text-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
}
</style>
