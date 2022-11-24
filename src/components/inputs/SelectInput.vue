<template>
  <q-select
    clearable
    v-model="localValue"
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition.required),
    ]"
  />
</template>

<script setup>
import { ref } from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const localValue = ref(props.attribute.value);
const options = ref(props.attribute.definition.rules.values);
</script>
