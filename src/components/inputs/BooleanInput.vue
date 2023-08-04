<template>
  <q-toggle
    v-model="localValue"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
    ]"
  />
</template>

<script setup>
import { toRef } from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const localValue = toRef(props, 'attribute').value.value;
</script>
