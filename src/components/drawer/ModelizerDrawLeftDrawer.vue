<template>
  <q-drawer
    v-model="isVisible"
    no-swipe-close
    bordered
    side="left"
    :width="400"
    data-cy="draw-page-left-drawer"
  >
    <q-splitter
      v-model="splitterModel"
      :limits="[10, 15]"
      style="height: calc(100vh - 64px);"
    >
      <template #before>
        <q-tabs
          v-model="active"
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
      </template>
      <template #after>
        <q-tab-panels
          v-model="active"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel
            name="components"
            class="q-pa-none"
          >
            <component-definitions-list
              v-if="plugin"
              :plugin="plugin"
              :templates="templates"
              :project-name="projectName"
            />
          </q-tab-panel>

          <q-tab-panel
            name="variables"
            class="q-pa-none"
          >
            <variable-list
              v-if="plugin"
              :variables="plugin.data.variables"
            />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
import ComponentDefinitionsList from 'src/components/list/ComponentDefinitionsList.vue';
import VariableList from 'src/components/list/VariableList.vue';

defineProps({
  plugin: {
    type: Object,
    required: true,
  },
  templates: {
    type: Array,
    default: () => [],
  },
  projectName: {
    type: String,
    required: true,
  },
});

const isVisible = ref(true);
const active = ref('components');
const splitterModel = ref(15);
</script>

<style lang="scss">
.left-drawer-tab .q-tab__label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}
</style>
