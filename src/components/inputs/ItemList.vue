<template>
  <q-expansion-item
    v-if="item.type === 'category'"
    expand-separator
    :label="item.name"
    header-class="text-weight-medium"
    default-closed
  >
    <item-list
      v-for="child in item.children"
      :key="child.name"
      :item="child"
      class="item-list"
      @select-item="(value) => $emit('select-item', value)"
    />
  </q-expansion-item>
  <q-item
    v-else
    v-ripple
    clickable
    @click="$emit('select-item', item.formattedName ? item.formattedName : item.value)"
  >
    <q-item-section
      v-if="item.name"
      class="item"
    >
      {{ item.name }}
    </q-item-section>
    <q-item-section
      avatar
      :class="!item.name ? item : null"
    >
      {{ item.value }}
    </q-item-section>
  </q-item>
</template>

<script setup>
import ItemList from 'components/inputs/ItemList';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

defineEmits(['select-item']);
</script>

<style scoped>
  .item-list {
    max-width: 280px;
    max-height: 288px;
    overflow-y: auto;
  }
  .item {
    width: 50%;
    word-break: break-all;
  }
</style>
