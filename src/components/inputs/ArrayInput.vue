<template>
  <q-select
    v-model="localValue"
    use-input
    use-chips
    multiple
    :options="options"
    hide-dropdown-icon
    input-debounce="0"
    new-value-mode="add"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
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

const options = ref(props.attribute.definition.rules.values);
const localValue = ref(props.attribute.value);
</script>
