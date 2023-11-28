<template>
  <q-select
    ref="linkInput"
    v-model="localValue"
    multiple
    clearable
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
    ]"
    :data-cy="`link-input_${attribute.name}`"
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

const linkInput = ref(null);
const { attribute, plugin } = toRefs(props);
const localValue = ref(attribute.value.value);
const options = ref(plugin.value.data.getComponentsByType(
  attribute.value.definition.linkRef,
).map(({ id }) => id));
const iconName = ref(plugin.value.data.definitions.components.find(
  ({ type }) => type === attribute.value.definition.linkRef,
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
      props.attribute.definition.linkRef,
    ).map(({ id }) => id);
  }
}

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (linkInput.value) {
    linkInput.value.validate();
  }
});

onMounted(() => {
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe(updateOptions);
});

onUnmounted(() => {
  pluginDefaultSubscription.unsubscribe();
});
</script>
