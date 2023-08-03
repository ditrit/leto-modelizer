<template>
  <q-select
    ref="linkInput"
    v-model="localValue"
    multiple
    clearable
    overflow-hidden
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

const linkInput = ref(null);
const { attribute, plugin } = toRefs(props);
const localValue = ref(attribute.value.value);
const options = ref(plugin.value.data.getComponentsByType(
  attribute.value.definition.linkRef,
).map(({ id }) => id));
const iconName = ref(plugin.value.data.definitions.components.find(
  ({ type }) => type === attribute.value.definition.linkRef,
).icon);
const defaultValues = ref(plugin.value.data.getComponentsByType(
  attribute.value.definition.linkRef,
).map(({ id }) => id));
const variables = ref(plugin.value.data.variables || []);

/**
 * Initialize the options for the select.
 */
function initOptions() {
  const categories = [...new Set(variables.value.map(({ category }) => category))];
  const children = categories.map((category) => ({
    type: 'category',
    name: category,
    children: variables.value
      .filter((variable) => variable.category === category)
      .map((variable) => ({
        type: 'item',
        name: variable.name,
        value: variable.value !== null ? variable.value : variable.defaultValue,
        formattedName: variable.formattedName,
      })),
  }));

  options.value = [{
    type: 'category',
    name: 'default',
    children: defaultValues.value.map((value) => ({
      type: 'item',
      value,
    })),
  }, {
    type: 'category',
    name: 'variable',
    children,
  }];
}

watch(() => props.plugin.data.components, () => {
  defaultValues.value = props.plugin.data.getComponentsByType(
    props.attribute.definition.linkRef,
  ).map(({ id }) => id);
});

watch(() => linkInput.value, () => {
  if (linkInput.value) {
    linkInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  localValue.value = props.attribute.value;

  if (linkInput.value) {
    linkInput.value.validate();
  }
});

watch(() => localValue.value, () => {
  emit('update:model-value', localValue.value);
});

onMounted(() => {
  initOptions();
});
</script>
