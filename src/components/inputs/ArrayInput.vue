<template>
  <q-select
    ref="arrayInput"
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
import { ref, toRef, watch } from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
});

const arrayInput = ref(null);
const options = toRef(props, 'attribute').value.definition.rules.values;
const localValue = toRef(props, 'attribute').value.value;

watch(() => arrayInput.value, () => {
  if (arrayInput.value) {
    arrayInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (arrayInput.value) {
    arrayInput.value.validate();
  }
});
</script>
