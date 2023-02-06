<template>
  <default-drawer
    data-cy="components-definitions-drawer"
    class="components-definitions-drawer"
  >
    <template v-slot:drawerName>
      {{ $t('page.modelizer.drawer.components.header') }}
    </template>
    <template v-slot:content>
      <q-input
        clearable
        v-model="definitionFilter"
        data-cy="filter-plugin-definitions"
        :label="$t('page.modelizer.drawer.components.filterLabel')"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-magnifying-glass" />
        </template>
      </q-input>
      <q-list text-white>
        <q-expansion-item
          expand-sperator
          group="components-definitions"
          header-class="text-bold"
          v-for="plugin in plugins"
          class="plugin-definitions"
          :key="plugin.data.name"
          :data-cy="`plugin-definitions-${plugin.data.name}`"
        >
          <template v-slot:header>
            <q-item-section data-cy="plugin-definitions-title">
              {{ plugin.data.name }}
            </q-item-section>
          </template>
          <q-scroll-area
            :style="`height: calc(100vh - ${scrollAreaHeight(definitions)}px);`"
            class="sunken-area"
          >
            <component-definition-grid
              :definitions="componentDefinitions[plugin.data.name]"
              :pluginName="plugin.data.name"
            />
          </q-scroll-area>
        </q-expansion-item>
        <q-expansion-item
          v-if="isTemplateLibraryUrlDefined"
          expand-sperator
          group="components-definitions"
          header-class="text-bold"
          class="template-definitions"
          data-cy="`template-definitions"
        >
          <template v-slot:header>
            <q-item-section data-cy="template-definitions-title">
              {{  $t('page.modelizer.drawer.templates.title') }}
            </q-item-section>
          </template>
          <q-scroll-area
            v-if="templates.length"
            :style="`height: calc(100vh - ${scrollAreaHeight(definitions)}px);`"
            class="sunken-area"
          >
            <component-definition-grid :definitions="templates"/>
          </q-scroll-area>
          <div
            v-else
            class="q-px-md q-py-sm text-italic text-grey"
          >
            {{  $t('page.modelizer.drawer.templates.emptyMessage') }}
          </div>
        </q-expansion-item>
      </q-list>
    </template>
  </default-drawer>
</template>

<script setup>
import { computed, ref } from 'vue';
import DefaultDrawer from 'src/components/drawer/DefaultDrawer';
import ComponentDefinitionGrid from 'src/components/grid/ComponentDefinitionGrid';

const isTemplateLibraryUrlDefined = !!process.env.TEMPLATE_LIBRARY_BASE_URL;

const props = defineProps({
  plugins: {
    type: Array,
    required: true,
  },
  templates: {
    type: Array,
    default: () => [],
  },
});

const definitionFilter = ref('');

/**
 * Indicate if searched text is found.
 * @param {String} filter - Searched text.
 * @param {String} value - Value to match with.
 * @return {Boolean} true if it is matching otherwise false.
 */
function isMatching(filter, value) {
  return !filter || !filter.trim() || filter.toLowerCase().split(' ')
    .filter((searchedText) => searchedText)
    .some((searchedText) => value.toLowerCase().includes(searchedText));
}

const componentDefinitions = computed(() => props.plugins.reduce((acc, { data }) => {
  acc[data.name] = data.definitions.components
    .filter((def) => isMatching(definitionFilter.value, def.type));

  return acc;
}, {}));

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
const definitions = ref({
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
});

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
