<template>
  <q-select
    ref="referenceInput"
    v-model="localValue"
    clearable
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
    ]"
    :data-cy="`ref-input_${attribute.name}`"
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
import {
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  watch,
} from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';
import PluginEvent from 'src/composables/events/PluginEvent';

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
).map(({ id }) => id));
const iconName = ref(plugin.value.data.definitions.components.find(
  ({ type }) => type === attribute.value.definition.containerRef,
).icon);

let pluginDefaultSubscription;

/**
 * Update input options.
 * @param {object} eventManager - Object containing event and plugin.
 * @param {object} eventManager.event - The triggered event.
 */
function updateOptions({ event }) {
  if (event.type === 'Drawer' && event.status === 'success' && !['move', 'resize'].includes(event.action)) {
    options.value = props.plugin.data.getComponentsByType(
      props.attribute.definition.containerRef,
    ).map(({ id }) => id);
  }
}

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (referenceInput.value) {
    referenceInput.value.validate();
  }
});

onMounted(() => {
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe(updateOptions);
});

onUnmounted(() => {
  pluginDefaultSubscription.unsubscribe();
});
</script>
