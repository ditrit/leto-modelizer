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
      <div
        :class="['tree-node-container tree-node items-center',
          {'selected-node' : selectedFile.id === node.id && !node.isFolder}]"
        @dblclick="onNodeClicked(node)"
        :data-cy="`file-explorer-${node.label}`"
      >
        <q-icon
          class="q-mx-sm"
          color="primary"
          size="xs"
          :name="`${node.icon}${expanded ? '-open' : ''}`"
        />
        <span
          :class="['tree-node', { 'text-bold' : selectedFile.id === node.id}]"
        >
          {{node.label}}
        </span>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import FileEvent from 'src/composables/events/FileEvent';
import { ref, onMounted, onUnmounted } from 'vue';
import { readProjectFile } from 'src/composables/Project';

const props = defineProps({
  nodes: {
    type: Array,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
});

const selectedFile = ref({ isSelected: false, id: '' });
let fileEventSubscription;

/**
 * Set selectedFile equal to file param.
 */
function setSelectedFile(file) {
  selectedFile.value = file;
}

/**
 * If node clicked from Tree is a file, set it as selectedFile value,
 * read file to get its content and pass it to OpenFileEvent.
 *
 * @param {Object} node - Tree node
 * Example { icon: "fa-regular fa-file", id: "terraform/app.tf", isFolder: false, label: "app.tf" }
 */
function onNodeClicked(node) {
  if (node.isFolder) return;
  setSelectedFile({ isSelected: true, id: node.id });
  readProjectFile(props.projectName, { path: node.id })
    .then(({ content }) => {
      FileEvent.OpenFileEvent.next({ id: node.id, label: node.label, content });
    });
}

onMounted(() => {
  fileEventSubscription = FileEvent.SelectFileEvent.subscribe(setSelectedFile);
});

onUnmounted(() => {
  fileEventSubscription.unsubscribe();
});

</script>

<style lang="scss" scoped>
.tree-node:hover {
  cursor: pointer;
}
.tree-node {
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.tree-node-container {
  width: 100%;
  display: inline-flex
}
.selected-node {
  background: rgba($primary, 0.2);
  border-radius: 4px
}
</style>
