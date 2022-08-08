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
      <div class="q-pa-xs col-xs-12 col-sm-12 col-md-12 text-primary">
        <component-definition-card :definition="props.row" />
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
});
const disablePagination = ref({ rowsPerPage: 0 });
</script>
