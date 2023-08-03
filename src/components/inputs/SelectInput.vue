<template>
  <q-select
    ref="selectInput"
    v-model="localValue"
    clearable
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition.required),
    ]"
  />
</template>

<script setup>
import { ref, toRef, watch } from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const selectInput = ref(null);
const attribute = toRef(props, 'attribute');
const localValue = attribute.value.value;
const options = ref(attribute.value.definition.rules.values);

watch(() => selectInput.value, () => {
  if (selectInput.value) {
    selectInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (selectInput.value) {
    selectInput.value.validate();
  }
});
</script>
