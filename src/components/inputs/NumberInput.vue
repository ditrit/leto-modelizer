<template>
  <q-input
    ref="numberInput"
    v-model.number="localValue"
    clearable
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
      (value) => isNumber($t, value),
      (value) => isNumberTooSmall($t, value, attribute.definition?.rules.min),
      (value) => isNumberTooBig($t, value, attribute.definition?.rules.max),
    ]"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  isRequired,
  isNumber,
  isNumberTooSmall,
  isNumberTooBig,
} from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const numberInput = ref(null);
const localValue = ref(props.attribute.value);

watch(() => numberInput.value, () => {
  if (numberInput.value) {
    numberInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (numberInput.value) {
    numberInput.value.validate();
  }
});
</script>
