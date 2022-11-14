<template>
  <component
    :is="inputList[attribute.definition.type]"
    :attribute="attribute"
    :plugin="plugin"
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
  plugin: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:attribute']);

const inputList = {
  Boolean: defineAsyncComponent(() => import('./BooleanInput')),
  String: defineAsyncComponent(() => import('./StringInput')),
  Number: defineAsyncComponent(() => import('./NumberInput')),
  Reference: defineAsyncComponent(() => import('./ReferenceInput')),
};
</script>
