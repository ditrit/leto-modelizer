<template>
  <q-table
    grid
    :rows="definitions"
    row-key="name"
    hide-header
    hide-bottom
    :pagination="disablePagination"
    class="component-definition-grid"
  >
    <template v-slot:item="props">
      <div class="q-pa-xs col-4 text-primary">
        <component-definition-card :definition="props.row" :pluginName="pluginName" />
      </div>
    </template>
  </q-table>
</template>

<script setup>
import { ref } from 'vue';
import ComponentDefinitionCard from 'src/components/card/ComponentDefinitionCard';

defineProps({
  definitions: {
    type: Array,
    required: true,
  },
  pluginName: {
    type: String,
    default: '',
  },
});
const disablePagination = ref({ rowsPerPage: 0 });
</script>
