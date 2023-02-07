<template>
  <q-select
    ref="linkInput"
    multiple
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

const linkInput = ref(null);
const localValue = ref(props.attribute.value);
const options = ref(props.plugin.data.getComponentsByType(
  props.attribute.definition.linkRef,
).map(({ id }) => id));
const iconName = ref(props.plugin.data.definitions.components.find(
  ({ type }) => type === props.attribute.definition.linkRef,
).icon);

watch(() => props.plugin.data.components, () => {
  options.value = props.plugin.data.getComponentsByType(
    props.attribute.definition.linkRef,
  ).map(({ id }) => id);
});

watch(() => linkInput.value, () => {
  if (linkInput.value) {
    linkInput.value.validate();
  }
});
</script>
