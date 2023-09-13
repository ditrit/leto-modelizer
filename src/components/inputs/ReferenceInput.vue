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
    <template #option="{ opt }">
      <item-list
        :item="opt"
        @select-item="(value) => localValue = [value]"
      />
    </template>
  </q-select>
</template>

<script setup>
import {
  onMounted,
  ref,
  toRefs,
  watch,
} from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';
import ItemList from 'components/inputs/ItemList';
import { initSelectOptions } from 'src/composables/InputManager';

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

const referenceInput = ref(null);
const { attribute, plugin } = toRefs(props);
const localValue = ref(attribute.value.value);
const options = ref([]);
const iconName = ref(plugin.value.data.definitions.components.find(
  ({ type }) => type === attribute.value.definition.containerRef,
).icon);
const defaultValues = ref(plugin.value.data.getComponentsByType(
  attribute.value.definition.containerRef,
  plugin.value.data.components,
).map(({ id }) => id));
const variables = ref(plugin.value.data.variables || []);

watch(() => props.plugin.data.components, () => {
  defaultValues.value = props.plugin.data.getComponentsByType(
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

watch(() => localValue.value, () => {
  emit('update:model-value', localValue.value);
});

onMounted(() => {
  options.value = initSelectOptions(variables.value, defaultValues.value);
});
</script>
