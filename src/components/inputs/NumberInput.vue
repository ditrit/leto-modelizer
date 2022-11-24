<template>
  <q-input
    type="number"
    v-model="localValue"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
      (value) => isNumberTooSmall($t, value, attribute.definition?.rules.min),
      (value) => isNumberTooBig($t, value, attribute.definition?.rules.max),
    ]"
  />
</template>

<script setup>
import { ref } from 'vue';
import {
  isRequired,
  isNumberTooSmall,
  isNumberTooBig,
} from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const localValue = ref(props.attribute.value);
</script>
