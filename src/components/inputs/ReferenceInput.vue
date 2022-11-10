<template>
  <q-select
    clearable
    v-model="localValue"
    :label="attribute.name"
    :options="options"
    @update:model-value="(event) => emit('update:model-value', event)"
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

const emit = defineEmits(['update:model-value']);

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
