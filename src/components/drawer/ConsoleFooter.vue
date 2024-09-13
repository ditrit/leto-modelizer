<template>
  <q-footer
    elevated
    class="console-footer"
  >
    <q-tabs
      v-model="selectedTab"
      dense
      align="left"
    >
      <q-tab
        v-for="tab in tabs"
        :key="tab.name"
        :label="$t(`footer.consoleFooter.tabs.${tab.name}`, { number: logs.length })"
        :name="tab.name"
        :data-cy="tab.name"
        @click="toggleTab(tab.name)"
      />
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-model="selectedTab"
      animated
    >
      <q-tab-panel
        name="errors"
        class="text-h6 q-pa-none"
        style="max-height: 379px; height: 379px; overflow-y: auto;"
      >
        <errors-table
          :errors="logs"
          :editor-type="props.editorType"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-footer>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import ErrorsTable from 'components/table/ErrorsTable';
import LogEvent from 'src/composables/events/LogEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';

const props = defineProps({
  editorType: {
    type: String,
    default: 'text',
  },
});
const selectedTab = ref(null);
const logs = ref([]);
const tabs = ref([{
  name: 'errors',
  open: false,
}]);

let fileLogEventSubscription;
/**
 * Expand or reduce tab (console footer with it).
 * @param {string} tabName - Name of the clicked tab
 */
function toggleTab(tabName) {
  const openedTab = tabs.value.find((t) => t.name === tabName);
  openedTab.open = !openedTab.open;

  if (!openedTab.open) {
    selectedTab.value = null;
  }

  DrawerEvent.next({
    type: openedTab.open ? 'open' : 'close',
    key: 'ConsoleFooter',
  });
}

/**
 * Update current logs.
 * @param {ParseLogs} fileLogs - Logs.
 */
function updateFileLogs(fileLogs) {
  logs.value = fileLogs;
}

onMounted(() => {
  fileLogEventSubscription = LogEvent.FileLogEvent.subscribe(
    (e) => { updateFileLogs(e); },
  );
});

onUnmounted(() => {
  fileLogEventSubscription.unsubscribe();
});
</script>

<style>
.console-footer {
  background-color: white;
  color: black;
  max-height: 413px;
}
</style>
