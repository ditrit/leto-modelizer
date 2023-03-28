<template>
  <div
    class="full-width row q-col-gutter-sm"
    data-cy="component-definition-grid"
  >
    <div
      v-for="(definition, index) in definitions"
      :key="`definition-card_${index}`"
      class="col-4"
    >
      <component-definition-card
        :definition="definition"
        :plugin-name="pluginName"
        class="full-height"
      />
    </div>
  </div>
</template>

<script setup>
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
</script>
