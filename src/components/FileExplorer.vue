<template>
  <q-tree
    ref="fileExplorerRef"
    :nodes="nodes"
    node-key="id"
    :no-nodes-label="$t('actions.fileExplorer.empty')"
    dense
    icon="fa-solid fa-chevron-right"
    no-transition
    no-selection-unset
    class="file-explorer"
    data-cy="file-explorer"
    :filter="filterTrigger"
    :filter-method="filterParsableFiles"
  >
    <template #default-header="{expanded, node}">
      <div
        :class="[
          'tree-node-container tree-node items-center',
          {'text-bold' : selectedFile.id === node.id && !node.isFolder},
          {'text-grey text-italic' : showParsableFiles && isFolderWithoutParsableFiles(node)},
        ]"
        @dblclick="onNodeClicked(node)"
        :data-cy="`file-explorer-${node.label}`"
      >
        <div>
          <q-icon
            class="q-mx-sm"
            color="primary"
            size="xs"
            :name="`${node.icon}${expanded ? '-open' : ''}`"
          />
          <file-name
            class="tree-node"
            :path="node.id"
            :isActive="selectedFile.id  === node.id"
            :label="node.label"
            :status="node.information?.status"
          />
        </div>
        <span class="col-grow"></span>
        <div class="row no-wrap">
          <file-explorer-action-card
            class="file-explorer-buttons"
            :file="node"
            :project-name="projectName"
          />
        </div>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import FileEvent from 'src/composables/events/FileEvent';
import { ref, onMounted, onUnmounted } from 'vue';
import { readProjectFile } from 'src/composables/Project';
import FileExplorerActionCard from 'src/components/card/FileExplorerActionCard.vue';
import FileName from 'src/components/FileName.vue';

const props = defineProps({
  nodes: {
    type: Array,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  showParsableFiles: {
    type: Boolean,
    default: false,
  },
});

const fileExplorerRef = ref(null);
const selectedFile = ref({ isSelected: false, id: '' });
const filterTrigger = ref(props.showParsableFiles.toString()); // must be a String according to https://quasar.dev/vue-components/tree

/**
 * Filter tree nodes to only display parsable files and folders if showParsableFiles is true.
 * @param {Object} node - Node currently being filtered.
 * @returns {Boolean} Result of tested conditions, otherwise true.
 * @see https://quasar.dev/vue-components/tree
 */
function filterParsableFiles(node) {
  let filterResult = true;

  if (props.showParsableFiles) {
    filterResult = node.isParsable || node.isFolder;
  }

  return filterResult;
}

/**
 * Check if node is a sub folder containing no parsable files.
 * @param {Object} node - Current node.
 * @returns {Boolean} Result of tested conditions.
 */
function isFolderWithoutParsableFiles(node) {
  return node.isFolder && !node.isRootFolder && !node.hasParsableFiles;
}

/**
 * Set selectedFile equal to file param.
 * @param {Object} file - Tree file object.
 */
function setSelectedFile(file) {
  selectedFile.value = file;
}

/**
 * If node clicked is a file, set it as selectedFile value,
 * read file to get its content and pass it to OpenFileEvent.
 * @param {Object} node - Tree node.
 * Example { icon: "fa-regular fa-file", id: "terraform/app.tf", isFolder: false, label: "app.tf" }
 */
function onNodeClicked(node) {
  if (node.isFolder) {
    return;
  }

  setSelectedFile({ isSelected: true, id: node.id });

  readProjectFile(props.projectName, { path: node.id })
    .then(({ content }) => {
      FileEvent.OpenFileEvent.next({
        id: node.id,
        label: node.label,
        content,
        information: node.information,
      });
    });
}

onMounted(() => {
});

onUnmounted(() => {
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
  display: inline-flex;
  padding: 1px 0px;

  &:hover {
    background: rgba($primary, 0.1);
    border-radius: 4px;

    .file-explorer-buttons {
      display: inline-block
    }
  }
}
.file-explorer-buttons {
  display: none
}
</style>

<style lang="scss">
/*
 * Target tree to override quasar `.q-focus-helper` default background style.
 * This style is not applied if used within scoped style
 */
.file-explorer .q-focus-helper {
  background: transparent !important;
}
</style>
