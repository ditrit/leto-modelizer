<template>
  <default-drawer
    class="components-definitions-drawer"
    data-cy="components-definitions-drawer"
  >
    <template #drawerName>
      {{ $t('page.modelizer.drawer.components.header') }}
    </template>
    <template #content>
      <div class="row justify-center">
        <q-btn
          :label="$t('page.modelizer.drawer.components.button.label')"
          :title="$t('page.modelizer.drawer.components.button.title')"
          color="positive"
          class="q-mr-md"
          no-caps
          data-cy="models-page-link-button"
          @click="router.push(`/${projectName}/models`)"
        />
      </div>
      <q-input
        v-model="definitionFilter"
        clearable
        :label="$t('page.modelizer.drawer.components.filterLabel')"
        data-cy="definitions-filter-input"
      >
        <template #prepend>
          <q-icon name="fa-solid fa-magnifying-glass" />
        </template>
      </q-input>
      <q-list text-white>
        <q-expansion-item
          v-if="plugin"
          :key="plugin.data.name"
          expand-sperator
          group="components-definitions"
          header-class="text-bold"
          class="plugin-definitions"
          :data-cy="`component-defnitions-item_${plugin.data.name}`"
        >
          <template #header>
            <q-item-section data-cy="title">
              {{ plugin.data.name }}
            </q-item-section>
          </template>
          <q-scroll-area
            :style="`height: calc(100vh - ${scrollAreaHeight(definitions)}px);`"
            class="sunken-area"
          >
            <component-definition-grid
              :definitions="componentDefinitions"
              :plugin-name="plugin.data.name"
            />
          </q-scroll-area>
        </q-expansion-item>
        <q-expansion-item
          v-if="isTemplateLibraryUrlDefined"
          expand-sperator
          group="components-definitions"
          header-class="text-bold"
          class="template-definitions"
          data-cy="template-definitions-item"
        >
          <template #header>
            <q-item-section data-cy="title">
              {{ $t('page.modelizer.drawer.templates.title') }}
            </q-item-section>
          </template>
          <q-scroll-area
            v-if="templates.length"
            :style="`height: calc(100vh - ${scrollAreaHeight(definitions)}px);`"
            class="sunken-area"
          >
            <component-definition-grid
              :definitions="templates"
              :plugin-name="plugin.data.name"
            />
          </q-scroll-area>
          <div
            v-else
            class="q-px-md q-py-sm text-italic text-grey"
          >
            {{ $t('page.modelizer.drawer.templates.emptyMessage') }}
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
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
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

const isTemplateLibraryUrlDefined = ref(!!process.env.TEMPLATE_LIBRARY_BASE_URL);
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

const componentDefinitions = computed(() => props.plugin?.data.definitions.components
  .filter((def) => isMatching(definitionFilter.value, def.type)));

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
