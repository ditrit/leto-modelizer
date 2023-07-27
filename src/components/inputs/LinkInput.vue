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
  >
    <template #prepend>
      <q-icon
        color="primary"
        :name="`img:/plugins/${plugin.data.name}/icons/${iconName}.svg`"
      />
    </template>
    <template #option="{ opt }">
      <select-expansion-item :item="opt" @select-item="console.log"/>
    </template>
  </q-select>
</template>

<script setup>
import {
  onMounted,
  ref,
  watch,
} from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';
import SelectExpansionItem from 'components/inputs/SelectExpansionItem.vue';

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
const localValue = ref(props.attribute.value);
const iconName = ref(props.plugin.data.definitions.components.find(
  ({ type }) => type === props.attribute.definition.linkRef,
).icon);
const defaultValues = ref(props.plugin.data.getComponentsByType(
  props.attribute.definition.linkRef,
).map(({ id }) => id));
const variables = ref(props.plugin.data.variables || []);
const options = ref([]);

function initOptions() {
  const categories = [...new Set(variables.value.map(({ category }) => category))];
  const children = categories.map((category) => ({
    type: 'category',
    name: category,
    children: variables.value
      .filter((variable) => variable.category === category)
      .map((variable) => ({
        type: 'item',
        value: variable.value,
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

watch(() => props.plugin.data.variables, () => {
  variables.value = props.plugin.data.variables;
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
