<template>
  <component
    :is="inputList[attributeType]"
    :attribute="attribute"
    :plugin="plugin"
    @update:model-value="(event) => emit('update:attribute', event)"
  />
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  plugin: {
    type: Object,
    required: true,
  },
});

const attributeType = ref(props.attribute.definition?.type || props.attribute.type);

const emit = defineEmits(['update:attribute']);

const inputList = {
  Boolean: defineAsyncComponent(() => import('./BooleanInput')),
  String: defineAsyncComponent(() => import('./StringInput')),
  Number: defineAsyncComponent(() => import('./NumberInput')),
  Reference: defineAsyncComponent(() => import('./ReferenceInput')),
};
</script>
