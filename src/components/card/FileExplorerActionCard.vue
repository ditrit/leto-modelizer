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
    @click.stop="updateSelectedNode"
  >
    <file-explorer-action-menu
      :file="file"
      @hide:menu="isActionMenuOpen = false"
    />
  </q-btn>
</template>

<script setup>
import { ref } from 'vue';
import FileEvent from 'src/composables/events/FileEvent';
import FileExplorerActionMenu from 'components/menu/FileExplorerActionMenu';

const isActionMenuOpen = ref(false);

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});

/**
 * Emit SelectNodeEvent and set isActionMenuOpen to true.
 */
function updateSelectedNode() {
  FileEvent.SelectNodeEvent.next(props.file);
  isActionMenuOpen.value = true;
}
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
