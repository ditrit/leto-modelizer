<template>
  <q-select
    clearable
    v-model="localValue"
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
    ]"
  >
    <template v-slot:prepend>
      <q-icon
        color="primary"
        :name="`img:/plugins/${plugin.name}/icons/${iconName}.svg`"
      />
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch } from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';
import { getComponentsByType } from 'src/composables/PluginManager';

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

const localValue = ref(props.attribute.value);
const options = ref(getComponentsByType(
  props.attribute.definition.containerRef,
  props.plugin.components,
).map(({ name }) => name));
const iconName = ref(props.plugin.definitions.components.find(
  ({ type }) => type === props.attribute.definition.containerRef,
).icon);

watch(() => props.plugin.components, () => {
  options.value = getComponentsByType(
    props.attribute.definition.containerRef,
    props.plugin.components,
  ).map(({ name }) => name);
});
</script>
