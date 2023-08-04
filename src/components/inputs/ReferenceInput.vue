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
import { ref, toRefs, watch } from 'vue';
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

const { attribute, plugin } = toRefs(props);
const referenceInput = ref(null);
const localValue = ref(attribute.value.value);
const options = ref(plugin.value.data.getComponentsByType(
  attribute.value.definition.containerRef,
  plugin.value.data.components,
).map(({ id }) => id));
const iconName = ref(plugin.value.data.definitions.components.find(
  ({ type }) => type === attribute.value.definition.containerRef,
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
