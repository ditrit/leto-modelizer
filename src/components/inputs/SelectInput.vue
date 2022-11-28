<template>
  <q-select
    ref="selectInput"
    clearable
    v-model="localValue"
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition.required),
    ]"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const selectInput = ref(null);
const localValue = ref(props.attribute.value);
const options = ref(props.attribute.definition.rules.values);

watch(() => selectInput.value, () => {
  if (selectInput.value) {
    selectInput.value.validate();
  }
});
</script>
