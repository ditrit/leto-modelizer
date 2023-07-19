<template>
  <q-list data-cy="variable-list">
    <q-item>
      <q-item-section>
        <q-item-label
          overline
          header
        >
          {{ $t('page.modelizer.drawer.variables.header') }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <div class="row justify-center">
      <q-btn
        :label="$t('page.modelizer.button.back.label')"
        :title="$t('page.modelizer.button.back.title')"
        color="positive"
        class="q-mr-md"
        no-caps
        data-cy="models-page-link-button"
        @click="router.push(`/projects/${projectName}/models`)"
      />
    </div>
    <q-expansion-item
      v-for="file in Object.keys(variableData)"
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
        v-for="category in Object.keys(variableData[file])"
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
          :rows="variableData[file][category]"
          :columns="columns"
          row-key="name"
          separator="horizontal"
          class="q-mr-sm"
        >
          <template #body-cell-name="{ row: { name } }">
            <q-td
              class="text-right"
              :data-cy="`name_${name}`"
            >
              <div>
                {{ name }}
              </div>
            </q-td>
          </template>
          <template #body-cell-value="{ row: { value } }">
            <q-td
              class="text-right"
              :data-cy="`value_${value}`"
            >
              {{ value }}
            </q-td>
          </template>
        </q-table>
      </q-expansion-item>
    </q-expansion-item>
    <div
      v-if="Object.keys(variableData).length === 0"
      class="text-subtitle2 text-grey q-ml-md q-mt-md"
      data-cy="variable-list-empty"
    >
      {{ $t('page.modelizer.drawer.variables.empty') }}
    </div>
  </q-list>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();
const props = defineProps({
  variables: {
    type: Array,
    default: () => [],
  },
});

const variableData = ref({});
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

/**
 * Transform the input variables into the desired formatted object.
 * @param {Variable[]} variables - Variables array.
 * @returns {Object} - The formatted variables object.
 */
function getFormattedVariables(variables) {
  const formattedVariables = {};

  variables.forEach((variable) => {
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
  variableData.value = getFormattedVariables(props.variables);
});
</script>
