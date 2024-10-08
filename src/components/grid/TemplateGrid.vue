<template>
  <q-card
    class="template-grid bg-white"
  >
    <q-card-section class="row justify-between">
      <div class="text-h6 text-secondary">
        <slot name="header" />
      </div>
      <q-select
        v-if="type === 'DIAGRAM'"
        v-model="selectedPlugin"
        outlined
        dense
        clearable
        class="search-bar"
        :label="$t('page.models.template.pluginsFilter')"
        :options="plugins.map(({ data }) => data.name)"
        data-cy="plugin-select"
        @update:model-value="loadTemplates({ pagination })"
      >
        <template #option="{ selected, opt, toggleOption }">
          <q-item
            :active="selected"
            clickable
            @click="toggleOption(opt)"
          >
            <q-item-section :data-cy="`item_${opt}`">
              {{ opt }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        v-model="searchTemplateText"
        outlined
        dense
        clearable
        class="search-bar"
        :label="$t('page.home.template.search')"
        data-cy="search-template-project-input"
        debounce="1000"
        @update:model-value="loadTemplates({ pagination })"
      >
        <template #prepend>
          <q-icon
            name="fa-solid fa-magnifying-glass"
            size="xs"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section
      class="q-ma-md q-pb-none bg-grey-1 template-card-container"
    >
      <q-table
        v-model:pagination="pagination"
        flat
        bordered
        grid
        :rows="templates"
        :loading="loading"
        @request="loadTemplates"
      >
        <template #item="data">
          <template-card
            :template="data.row"
            class="template-card q-ma-md"
            @click="$emit('add:template', data.row)"
          />
        </template>
        <template #no-data>
          <div
            v-if="hasRole"
            class="row text-center text-subtitle2 text-grey q-mb-md"
            data-cy="template-grid-empty"
          >
            {{ $t('page.home.template.empty') }}
          </div>
          <div
            v-else
            class="row text-center text-subtitle2 text-grey q-mb-md"
            data-cy="template-grid-unauthorized"
          >
            {{ $t('errors.permissionsDenied') }}
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import TemplateCard from 'src/components/card/TemplateCard.vue';
import { getTemplatesByType } from 'src/services/TemplateService';
import { getPlugins } from 'src/composables/PluginManager';
import { useAcl } from 'vue-simple-acl';

defineEmits(['add:template']);

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const acl = useAcl();
const hasRole = ref(true);
const plugins = reactive(getPlugins());
const selectedPlugin = ref(null);
const templates = ref([]);
const loading = ref(false);
const searchTemplateText = ref('');
const pagination = ref({
  page: 0,
  rowsPerPage: 5,
});

/**
 * load templates.
 * @param {object} event - Event that contains pagination.
 * @param {object} event.pagination - New pagination value.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function loadTemplates({ pagination: newPagination }) {
  hasRole.value = acl.role(`create-${props.type.toLowerCase()}-from-template`);
  if (!hasRole.value) {
    templates.value = [];
    return Promise.resolve();
  }

  const { page, rowsPerPage } = newPagination;
  const name = searchTemplateText.value ? searchTemplateText.value.trim() : '';

  loading.value = true;

  return getTemplatesByType({
    HAS_BACKEND: process.env.HAS_BACKEND,
    TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
  }, props.type, {
    page: page - 1,
    count: rowsPerPage,
    name,
    plugin: !selectedPlugin.value ? '' : selectedPlugin.value,
  }).then((data) => {
    templates.value = data.content;
    pagination.value.page = data.pageable.pageNumber + 1;
    pagination.value.rowsPerPage = data.pageable.pageSize;
    pagination.value.rowsNumber = data.totalElements;
  }).finally(() => {
    loading.value = false;
  });
}

onMounted(() => {
  loadTemplates({ pagination: pagination.value });
});
</script>

<style scoped>
.template-card-container {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
.search-bar {
  min-width: 300px;
}
</style>
