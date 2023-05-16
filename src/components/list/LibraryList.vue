<template>
  <q-input
    v-model="definitionFilter"
    clearable
    class="q-px-md"
    :label="inputLabel"
    data-cy="definitions-filter-input"
  >
    <template #prepend>
      <q-icon name="fa-solid fa-magnifying-glass" />
    </template>
  </q-input>
  <q-list
    text-white
    :class="[
      'column no-wrap col-shrink',
      !isSelected ? 'scroll' : '',
    ]"
  >
    <template
      v-for="(drawerItem) in drawerItems"
      :key="drawerItem.id"
    >
      <library-item
        v-if="drawerItem.size > 0 && (selectedItemId === drawerItem.id || selectedItemId === null)"
        :item="drawerItem"
        :is-selected="isSelected"
        @click="onItemClick(drawerItem.id)"
      />
    </template>
    <q-item
      v-if="selectedItemId && !isEmptyList"
      style="overflow-y: auto !important;"
      class="q-pa-none q-mb-sm"
    >
      <component-definition-grid
        :definitions="selectedItemDefinitions"
        :plugin-name="plugin.data.name"
        class="q-mt-xs q-pr-sm"
      />
    </q-item>
    <div
      v-if="isEmptyList"
      class="q-px-md q-py-sm text-italic text-grey full-height"
      data-cy="library-empty-message"
    >
      {{ $t('page.modelizer.drawer.components.empty') }}
    </div>
  </q-list>
</template>

<script setup>
import { ref, computed } from 'vue';
import ComponentDefinitionGrid from 'src/components/grid/ComponentDefinitionGrid';
import LibraryItem from 'src/components/item/LibraryItem';
import { useI18n } from 'vue-i18n';
import { isMatching } from 'src/composables/Project';

const { t } = useI18n();
const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
  templates: {
    type: Array,
    default: () => [],
  },
});

const definitionFilter = ref('');
const selectedItemId = ref(null);
const isSelected = ref(false);
// TODO : remove this const
// when @quasar/quasar-app-extension-testing-unit-jest@3.0.0 is officially released
const inputLabel = computed(() => t('page.modelizer.drawer.components.filterLabel'));

const pluginDefinitions = computed(() => props.plugin?.data.definitions.components
  .filter((def) => isMatching(definitionFilter.value, def.type)));

const templateDefinitions = computed(() => props.templates
  .filter((def) => isMatching(definitionFilter.value, def.type)));

const isEmptyList = computed(() => pluginDefinitions.value.length === 0
  && templateDefinitions.value.length === 0);

const drawerItems = computed(() => [
  {
    id: props.plugin.data.name,
    title: 'Components',
    definitions: pluginDefinitions.value,
    size: pluginDefinitions.value.length,
  },
  {
    id: t('page.modelizer.drawer.templates.title'),
    title: t('page.modelizer.drawer.templates.title'),
    definitions: templateDefinitions.value,
    size: templateDefinitions.value.length,
  },
]);

const selectedItemDefinitions = computed(() => drawerItems.value
  .find(({ id }) => selectedItemId.value === id)?.definitions);

/**
 * Toggle isSelected value and set selectedItemId on library item click.
 * @param {string} id - Id of clicked library item.
 */
function onItemClick(id) {
  isSelected.value = !isSelected.value;

  if (isSelected.value) {
    selectedItemId.value = id;
  } else {
    selectedItemId.value = null;
  }
}
</script>
