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
    :filter="filterTrigger"
    :filter-method="filterParsableFiles"
    data-cy="file-explorer"
  >
    <template #default-header="{expanded, node}">
      <div
        :class="[
          'tree-node-container tree-node items-center',
          {'text-bold' : activeFileId === node.id && !node.isFolder},
          {'text-grey text-italic' : showParsableFiles && isFolderWithoutParsableFiles(node)},
        ]"
        @dblclick="onNodeDoubleClicked(node)"
      >
        <div>
          <q-icon
            class="q-mx-sm"
            color="primary"
            size="xs"
            :name="`${node.icon}${expanded ? '-open' : ''}`"
            :data-cy="`${node.isFolder ? 'folder': 'file'}-icon_${node.id}`"
          />
          <file-name
            class="tree-node"
            :path="node.id"
            :is-active="activeFileId === node.id"
            :label="node.label"
            :status="node.information?.status"
            :is-folder="node.isFolder"
          />
        </div>
        <span class="col-grow" />
        <div class="row no-wrap">
          <file-explorer-action-card
            class="file-explorer-button"
            :file="node"
            :project-name="projectName"
            :data-cy="`${node.isFolder ? 'folder': 'file'}-button_${node.id}`"
          />
        </div>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import FileEvent from 'src/composables/events/FileEvent';
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import FileExplorerActionCard from 'src/components/card/FileExplorerActionCard.vue';
import FileName from 'src/components/FileName.vue';
import { getTree } from 'src/composables/FileExplorer';

const props = defineProps({
  fileInformations: {
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
const nodes = ref([]);
const activeFileId = ref(null);
const filterTrigger = ref(props.showParsableFiles.toString()); // must be a String according to https://quasar.dev/vue-components/tree

let selectFileTabSubscription;
let createFileNodeSubscription;

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
 * Check if node is a folder containing no parsable files.
 * @param {Object} node - Current node.
 * @returns {Boolean} Result of tested conditions.
 */
function isFolderWithoutParsableFiles(node) {
  return node.isFolder && !node.isRootFolder && !node.hasParsableFiles;
}

/**
 * Expand a node by its id. If the created node is a file, update activeFileId with the file's id
 * and send SelectFileNode event.
 * @param {String} parentNodePath - The parent node's path of the created file node.
 * @param {Object} node - The created file node.
 * @param {Boolean} isFolder - True if the created file node is a folder, otherwise false.
 */
function onCreateFileNode({ parentNodePath, node, isFolder }) {
  if (fileExplorerRef.value.getNodeByKey(parentNodePath)) {
    fileExplorerRef.value.setExpanded(parentNodePath, true);

    if (!fileExplorerRef.value.isExpanded(parentNodePath)) {
      // asynchronus behavior not explained (maybe quasar?)
      setTimeout(() => onCreateFileNode({ parentNodePath, node, isFolder }), 1);
      return;
    }

    if (!isFolder) {
      activeFileId.value = node.id;
      FileEvent.SelectFileNodeEvent.next(node);
    }
  }
}

/**
 * If node doubleclicked is a file, set activeFileId value to the file's id and
 * send SelectFileNode event.
 * @param {Object} node - Tree node.
 * Example { icon: "fa-regular fa-file", id: "terraform/app.tf", isFolder: false, label: "app.tf" }
 */
function onNodeDoubleClicked(node) {
  if (node.isFolder) {
    return;
  }

  activeFileId.value = node.id;
  FileEvent.SelectFileNodeEvent.next(node);
}

/**
 * Update file explorer tree nodes.
 */
function updateFileExplorer() {
  nodes.value = getTree(props.projectName, props.fileInformations);
}

watch(() => props.fileInformations, () => {
  updateFileExplorer();
}, { deep: true });

onMounted(() => {
  updateFileExplorer();
  selectFileTabSubscription = FileEvent.SelectFileTabEvent.subscribe((id) => {
    activeFileId.value = id;
  });
  createFileNodeSubscription = FileEvent.CreateFileNodeEvent.subscribe(onCreateFileNode);
});

onUnmounted(() => {
  selectFileTabSubscription.unsubscribe();
  createFileNodeSubscription.unsubscribe();
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

    .file-explorer-button {
      display: inline-block
    }
  }
}
.file-explorer-button {
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
