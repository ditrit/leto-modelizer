<template>
  <div class="row flex-1">
    <q-tabs
      v-model="currentTab"
      vertical
      dense
      active-color="accent"
      indicator-color="accent"
      class="text-grey"
    >
      <q-tab
        name="components"
        :label="$t('page.modelizer.drawer.tabs.components')"
        content-class="left-drawer-tab q-my-md"
        no-caps
        data-cy="draw-page-components-tab"
      />
      <q-tab
        name="variables"
        :label="$t('page.modelizer.drawer.tabs.variables')"
        content-class="left-drawer-tab q-my-md"
        no-caps
        data-cy="draw-page-variables-tab"
      />
    </q-tabs>
    <q-separator vertical />
    <q-tab-panels
      v-model="currentTab"
      animated
      vertical
      class="flex-1"
      transition-prev="jump-up"
      transition-next="jump-up"
      :style="`height: calc(100vh - ${offset}px);`"
    >
      <components-tab-panel
        v-if="plugin"
        name="components"
        :plugin="plugin"
      />
      <variables-tab-panel name="variables" />
    </q-tab-panels>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getPluginByName } from 'src/composables/PluginManager';
import { useRoute } from 'vue-router';
import ComponentsTabPanel from 'components/tab-panel/ComponentsTabPanel.vue';
import VariablesTabPanel from 'components/tab-panel/VariablesTabPanel.vue';

defineProps({
  offset: {
    type: Number,
    required: true,
  },
});

const route = useRoute();
const currentTab = ref('components');
const plugin = ref(null);

onMounted(() => {
  plugin.value = getPluginByName(route.query.plugin);
});
</script>
