<template>
  <q-select
    ref="referenceInput"
    v-model="localValue"
    clearable
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
    ]"
  >
    <template #prepend>
      <q-icon
        color="primary"
        :name="`img:/plugins/${plugin.data.name}/icons/${iconName}.svg`"
      />
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch } from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  plugin: {
    type: Object,
    required: true,
  },
});

const referenceInput = ref(null);
const localValue = ref(props.attribute.value);
const options = ref(props.plugin.data.getComponentsByType(
  props.attribute.definition.containerRef,
  props.plugin.data.components,
).map(({ id }) => id));
const iconName = ref(props.plugin.data.definitions.components.find(
  ({ type }) => type === props.attribute.definition.containerRef,
).icon);

watch(() => props.plugin.data.components, () => {
  options.value = props.plugin.data.getComponentsByType(
    props.attribute.definition.containerRef,
  ).map(({ id }) => id);
});

watch(() => referenceInput.value, () => {
  if (referenceInput.value) {
    referenceInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (referenceInput.value) {
    referenceInput.value.validate();
  }
});
</script>
