<template>
  <q-expansion-item
    v-if="item.type === 'category'"
    expand-separator
    :label="item.name"
    header-class="text-weight-medium"
    default-closed
  >
    <select-expansion-item
      v-for="child in item.children"
      :key="child.name"
      :item="child"
      @select-item="(value) => $emit('select-item', value)"
    />
  </q-expansion-item>
  <q-item
    v-else
    v-ripple
    clickable
    @click="$emit('select-item', item.value);
    "
  >
    <q-item-section>
      {{ item.value }}
    </q-item-section>
  </q-item>
</template>

<script setup>
import SelectExpansionItem from 'src/components/inputs/SelectExpansionItem';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

defineEmits(['select-item']);
</script>
