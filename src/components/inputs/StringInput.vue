<template>
  <q-input
    clearable
    v-model="localValue"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
      (value) => isStringTooShort($t, value, attribute.definition?.rules.min),
      (value) => isStringTooLong($t, value, attribute.definition?.rules.max),
      (value) => isStringMatchingRegExp($t, value, attribute.definition?.rules.regex),
    ]"
  />
</template>

<script setup>
import { ref } from 'vue';
import {
  isRequired,
  isStringTooShort,
  isStringTooLong,
  isStringMatchingRegExp,
} from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const localValue = ref(props.attribute.value);
</script>
