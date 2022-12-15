<template>
  <q-btn
    v-bind="$attrs"
    round
    flat
    dense
    size="xs"
    :class="['tree-action-button', { 'inline-block' : isActionMenuOpen }]"
    color="primary"
    icon="fa-solid fa-ellipsis-vertical"
    @click.stop="isActionMenuOpen = true"
  >
    <file-explorer-action-menu
      :file="file"
      :project-name="projectName"
      @hide:menu="isActionMenuOpen = false"
    />
  </q-btn>
</template>

<script setup>
import { ref } from 'vue';
import FileExplorerActionMenu from 'components/menu/FileExplorerActionMenu';

const isActionMenuOpen = ref(false);

defineProps({
  file: {
    type: Object,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.inline-block {
  display: inline-block
}
</style>

<style lang="scss">
/*
 * Target tree action button icon to override quasar `.q-icon` default font-size of 21px.
 * This style is not applied if used within scoped style.
 */
.tree-action-button .q-icon {
  font-size: 14px !important
}
</style>
