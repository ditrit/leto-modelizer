<template>
  <default-drawer
    data-cy="components-definitions-drawer"
    class="components-definitions-drawer"
  >
    <template v-slot:drawerName>
      {{ $t('page.modelizer.drawer.components.header') }}
    </template>
    <template v-slot:content>
      <q-list text-white>
        <q-expansion-item
          expand-sperator
          group="components-definitions"
          header-class="text-bold"
          v-for="plugin in plugins"
          :key="plugin.data.name"
          :label="plugin.data.name"
        >
          <q-scroll-area
            :style="`height: calc(100vh - ${scrollAreaHeight(definitions)}px);`"
            class="sunken-area"
          >
            <component-definition-grid
              :definitions="plugin.data.definitions.components"
              :pluginName="plugin.data.name"
            />
          </q-scroll-area>
        </q-expansion-item>
      </q-list>
    </template>
  </default-drawer>
</template>

<script setup>
import { computed } from 'vue';
import DefaultDrawer from 'src/components/drawer/DefaultDrawer';
import ComponentDefinitionGrid from 'src/components/grid/ComponentDefinitionGrid';

defineProps({
  plugins: Array,
  test: String,
});

/**
 * @typedef {{
 *  type: string;
 *  svgImage: string;
 * }} ComponentDefinition
 * @typedef {{
 *  name: string;
 *  definitions: ComponentDefinition[];
 * }} DefinitionsGroup
 *
 * The `definitions` should be an object with
 * ComponentsGroup as values and their id as key
 */
const definitions = computed(() => ({
  'plugin-1': {
    name: 'Plugin 1',
    definitions: Array.from({ length: 20 }, (_, i) => ({
      type: `Definition ${i}`,
    })),
  },
  'plugin-2': {
    name: 'Plugin 2',
    definitions: Array.from({ length: 20 }, (_, i) => ({
      type: `Definition ${i}`,
    })),
  },
}));

/**
 * Returns the negative height an expansion-item should fill.
 *
 * @todo replace with the appropriate CSS properties
 */
function scrollAreaHeight(categories) {
  const cumulativeHeaderHeight = 130;
  const listItemHeight = 48;
  return cumulativeHeaderHeight + listItemHeight * Object.keys(categories).length;
}
</script>

<style scoped>
.sunken-area {
  box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, 0.2);
}
</style>
