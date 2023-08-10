<template>
  <q-input
    ref="stringInput"
    v-model="localValue"
    clearable
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
      (value) => isStringTooShort($t, value, attribute.definition?.rules.min),
      (value) => isStringTooLong($t, value, attribute.definition?.rules.max),
      (value) => isStringMatchingRegExp($t, value, attribute.definition?.rules.regex),
    ]"
  />
</template>

<script setup>
import { ref, toRef, watch } from 'vue';
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

const stringInput = ref(null);
const localValue = ref(toRef(props, 'attribute').value.value);

watch(() => stringInput.value, () => {
  if (stringInput.value) {
    stringInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (stringInput.value) {
    stringInput.value.validate();
  }
});
</script>
