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
      'scroll'
    ]"
    style="max-height: calc(100vh - 260px);"
  >
    <template
      v-for="(drawerItem) in drawerItems"
      :key="drawerItem.id"
    >
      <library-item
        v-if="drawerItem.size > 0
          && (selectedItemId === drawerItem.id || selectedItemId === null)"
        :item="drawerItem"
        :is-selected="isSelected"
        @click="onItemClick(drawerItem.id)"
      />
    </template>
    <template v-if="selectedItemId">
      <div
        v-if="!hasRole"
        class="q-px-md q-py-sm text-italic text-grey full-height"
        data-cy="library-unauthorized-message"
      >
        {{ $t('errors.permissionsDenied') }}
      </div>
      <q-item
        v-else-if="!isEmptyList"
        class="q-pa-none q-mb-sm item-grid"
      >
        <component-definition-grid
          :definitions="selectedItemDefinitions"
          :plugin-name="plugin.data.name"
          class="q-mt-xs q-pr-sm"
        />
      </q-item>
    </template>
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
import ComponentDefinitionGrid from 'src/components/grid/ComponentDefinitionGrid.vue';
import LibraryItem from 'src/components/item/LibraryItem.vue';
import { useI18n } from 'vue-i18n';
import { isMatching } from 'src/composables/Project';
import { useAcl } from 'vue-simple-acl';

const acl = useAcl();
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
    title: t(`${props.plugin.data.name}.displayName`),
    definitions: pluginDefinitions.value,
    size: pluginDefinitions.value.length,
    hasRole: acl.role('create-component'),
  },
  {
    id: t('page.modelizer.drawer.templates.title'),
    title: t('page.modelizer.drawer.templates.title'),
    definitions: templateDefinitions.value,
    size: templateDefinitions.value.length,
    hasRole: acl.role('create-component-from-template'),
  },
]);
const selectedItemDefinitions = computed(() => drawerItems.value
  .find(({ id }) => selectedItemId.value === id)?.definitions);
const hasRole = computed(() => drawerItems.value
  .find(({ id }) => selectedItemId.value === id)?.hasRole || false);

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

<style lang="scss" scoped>
  .item-grid {
    overflow-y: auto !important;
  }
</style>
