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
        :label="tab.label"
        :name="tab.name"
        :data-cy="`console-tab_${tab.name}`"
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
        class="text-h6"
      >
        <errors-table :errors="props.errors" />
      </q-tab-panel>
    </q-tab-panels>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue';
import ErrorsTable from 'components/table/ErrorsTable';

const props = defineProps({
  errors: {
    type: Array,
    required: true,
  },
});

const selectedTab = ref(null);
const tabs = ref([
  { name: 'errors', label: `errors (${props.errors.length})`, open: false },
]);

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
}
</script>

<style>
.console-footer {
  background-color: white;
  color: black;
}
</style>
