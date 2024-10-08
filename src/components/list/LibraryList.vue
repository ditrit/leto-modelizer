<template>
  <q-input
    v-model="definitionFilter"
    clearable
    class="q-px-md"
    debounce="1000"
    :label="inputLabel"
    data-cy="definitions-filter-input"
    @update:model-value="initTemplates"
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
        class="q-pa-none q-mb-sm item-grid column"
      >
        <component-definition-grid
          :definitions="selectedItemDefinitions"
          :plugin-name="plugin.data.name"
          class="q-mt-xs q-pr-sm"
        />
        <q-btn
          v-if="haveMoreTemplates"
          outline
          no-caps
          icon="fa-solid fa-ellipsis"
          color="primary"
          class="q-ma-sm"
          label="load more"
          :loading="loading"
          @click="loadMoreTemplates"
        >
          <template #loading>
            <q-spinner-dots />
          </template>
        </q-btn>
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
import { ref, computed, onMounted } from 'vue';
import ComponentDefinitionGrid from 'src/components/grid/ComponentDefinitionGrid.vue';
import LibraryItem from 'src/components/item/LibraryItem.vue';
import { useI18n } from 'vue-i18n';
import { isMatching } from 'src/composables/Project';
import { useAcl } from 'vue-simple-acl';
import { getTemplatesByType } from 'src/services/TemplateService';

const acl = useAcl();
const { t } = useI18n();
const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
});
const templates = ref([]);
const totalTemplates = ref(0);
const definitionFilter = ref('');
const selectedItemId = ref(null);
const isSelected = ref(false);
const loading = ref(false);
const haveMoreTemplates = ref(true);
const currentPage = ref(0);
// TODO : remove this const
// when @quasar/quasar-app-extension-testing-unit-jest@3.0.0 is officially released
const inputLabel = computed(() => t('page.modelizer.drawer.components.filterLabel'));
const pluginDefinitions = computed(() => props.plugin?.data.definitions.components
  .filter((def) => isMatching(definitionFilter.value, def.displayName || def.type)));
const isEmptyList = computed(() => pluginDefinitions.value.length === 0
  && templates.value.length === 0);
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
    definitions: templates.value,
    size: totalTemplates.value,
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

/**
 * Load templates.
 * @param {number} page - Current page for pagination.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function loadTemplates(page) {
  loading.value = true;
  currentPage.value = page;
  const name = definitionFilter.value ? definitionFilter.value.trim() : '';

  return getTemplatesByType({
    HAS_BACKEND: process.env.HAS_BACKEND,
    TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
  }, 'COMPONENT', {
    plugin: props.plugin.data.name,
    count: 15,
    page: currentPage.value,
    name,
  }).then((data) => {
    haveMoreTemplates.value = data.pageable.pageNumber + 1 < data.totalPages;
    currentPage.value = data.pageable.pageNumber;
    totalTemplates.value = data.totalElements;

    return data.content.map((template) => ({
      ...template,
      isTemplate: true,
    }));
  }).finally(() => {
    loading.value = false;
  });
}

/**
 * Initialize templates by loading page 0.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function initTemplates() {
  return loadTemplates(0).then((data) => {
    templates.value = data;
  });
}

/**
 * Load templates for next page after the current.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function loadMoreTemplates() {
  return loadTemplates(currentPage.value + 1).then((data) => {
    data.forEach((template) => {
      templates.value.push(template);
    });
  });
}

onMounted(() => {
  initTemplates();
});
</script>

<style lang="scss" scoped>
  .item-grid {
    overflow-y: auto !important;
  }
</style>
