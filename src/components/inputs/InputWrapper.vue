<template>
  <component
    :is="inputList[attribute.type]"
    :attribute="attribute"
    @update:model-value="(event) => emit('update:attribute', event)"
  />
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

defineEmits(['update:attribute']);

const inputList = {
  Boolean: defineAsyncComponent(() => import('./BooleanInput')),
  String: defineAsyncComponent(() => import('./StringInput')),
  Number: defineAsyncComponent(() => import('./NumberInput')),
};
</script>
