<template>
  <q-tree
    :nodes="nodes"
    node-key="label"
    :no-nodes-label="$t('actions.fileExplorer.empty')"
    dense
    icon="fa-solid fa-chevron-right"
    data-cy="file-explorer"
  >
    <template #default-header="{expanded, node}">
      <div class="tree-node">
        <q-icon
          color="primary"
          :name="`${node.icon}${expanded ? '-open' : ''}`"
          class="q-mx-sm"
        />
        <span
          @click="selected = node.id"
          :class="{ 'text-bold' : selected === node.id}"
        >
          {{node.label}}
        </span>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import { ref } from 'vue';

const selected = ref('');

defineProps({
  nodes: {
    type: Array,
    required: true,
  },
});

</script>

<style lang="scss" scoped>
.tree-node:hover {
  cursor: pointer;
}
</style>
