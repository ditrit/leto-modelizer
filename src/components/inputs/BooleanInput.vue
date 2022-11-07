<template>
  <q-toggle
    v-model="localValue"
    :label="attribute.name"
    @update:model-value="(event) => emit('update:model-value', event)"
  />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:model-value']);

const localValue = ref(props.attribute.value);
</script>
