<template>
  <q-select
    ref="selectInput"
    v-model="localValue"
    clearable
    :options="options"
    :rules="[
      (value) => isRequired($t, value, attribute.definition.required),
    ]"
  >
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

const selectInput = ref(null);
const { attribute, plugin } = toRefs(props);
const localValue = ref(attribute.value.value);
const options = ref([]);
const defaultValues = ref(attribute.value.definition.rules.values);
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

watch(() => selectInput.value, () => {
  if (selectInput.value) {
    selectInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  if (props.attribute.value) {
    localValue.value = props.attribute.value;
  }

  if (selectInput.value) {
    selectInput.value.validate();
  }
});

watch(() => localValue.value, () => {
  emit('update:model-value', localValue.value);
});

onMounted(() => {
  initOptions();
});
</script>
