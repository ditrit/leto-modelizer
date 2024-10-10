<template>
  <q-tab-panel
    name="variables"
    class="q-pa-none column no-wrap"
  >
    <q-list data-cy="variable-list">
      <q-expansion-item
        v-for="file in Object.keys(variables)"
        :key="file"
        :label="file"
        switch-toggle-side
        dense
        dense-toggle
        expand-icon="fa-solid fa-chevron-up"
        expanded-icon="fa-solid fa-chevron-down"
        default-opened
        expand-icon-class="text-primary"
        class="text-primary text-subtitle1 q-mt-md"
        :data-cy="`variable-item_${file}`"
      >
        <q-expansion-item
          v-for="category in Object.keys(variables[file])"
          :key="`${file}_${category}`"
          :label="category"
          :header-inset-level="0.5"
          :content-inset-level="1"
          switch-toggle-side
          dense
          dense-toggle
          default-opened
          expand-icon="fa-solid fa-chevron-up"
          expanded-icon="fa-solid fa-chevron-down"
          expand-icon-class="text-primary"
          class="text-subtitle2"
          :data-cy="`variable-item_${file}_${category}`"
        >
          <q-table
            flat
            bordered
            hide-bottom
            dense
            :rows="variables[file][category]"
            :columns="columns"
            row-key="name"
            separator="horizontal"
            class="q-mr-sm"
            table-header-class="text-left"
          >
            <template #body-cell-name="{ row: { name } }">
              <q-td
                class="text-left"
                :data-cy="`name_${name}`"
              >
                <div>
                  {{ name }}
                </div>
              </q-td>
            </template>
            <template #body-cell-value="{ row: { value } }">
              <q-td
                class="text-left"
                :data-cy="`value_${value}`"
              >
                {{ value }}
              </q-td>
            </template>
          </q-table>
        </q-expansion-item>
      </q-expansion-item>
      <div
        v-if="Object.keys(variables).length === 0"
        class="text-subtitle2 text-grey q-ml-md q-mt-md"
        data-cy="variable-list-empty"
      >
        {{ $t('page.modelizer.drawer.variables.empty') }}
      </div>
    </q-list>
  </q-tab-panel>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { getPluginByName } from 'src/composables/PluginManager';

const route = useRoute();
const { t } = useI18n();
const columns = computed(() => [
  {
    name: 'name',
    label: t('page.modelizer.drawer.variables.name'),
    field: 'name',
  },
  {
    name: 'value',
    label: t('page.modelizer.drawer.variables.value'),
    field: 'value',
  },
]);
const variables = ref({});

/**
 * Retrieve variables from plugin and transform them into the desired formatted object.
 * @returns {object} - The formatted variables object.
 */
function getFormattedVariables() {
  const plugin = getPluginByName(route.query.plugin);
  const formattedVariables = {};

  if (!plugin) {
    return formattedVariables;
  }

  plugin.data.variables.forEach((variable) => {
    const { path, category } = variable;

    if (!formattedVariables[path]) {
      formattedVariables[path] = {};
    }

    if (!formattedVariables[path][category]) {
      formattedVariables[path][category] = [];
    }

    formattedVariables[path][category].push(variable);
  });

  return formattedVariables;
}

onMounted(() => {
  variables.value = getFormattedVariables();
});
</script>
