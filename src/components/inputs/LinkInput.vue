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
    <template #option="scope">
      <q-expansion-item
        expand-separator
        header-class="text-weight-bold"
        :label="scope.opt.category"
      >
        <select-expansion-item
          v-for="child in scope.opt.children"
          :key="child.category"
          :category="child.category"
          :children="child.children"
          :value="child.value"
          @update:model-value="updateModelValue()"
        />
      </q-expansion-item>
    </template>
  </q-select>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
} from 'vue';
import { isRequired } from 'src/composables/QuasarFieldRule';
import SelectExpansionItem from 'src/components/inputs/SelectExpansionItem';

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
const variables = ref(props.plugin.data.variables);
const variableValues = computed(() => variables.value
  .reduce((acc, { category, value }) => {
    const existingItem = acc.find((item) => item.category === category);

    if (existingItem) {
      existingItem.children.push({ value });
    } else {
      acc.push({ category, children: [{ value }] });
    }

    return acc;
  }, []));
const options = computed(() => [
  {
    category: 'Default values',
    children: defaultValues.value.map((value) => ({ value })),
  },
  {
    category: 'Variables',
    children: variableValues.value,
  },
]);

console.log('options', JSON.stringify(options.value, null, 2));

/**
 * Check if the given scope options contains the local value.
 * @param {Object} scope - The given scope.
 * @return {Boolean} true if one of the options equals the local value, otherwise false.
 */
// function hasChild(scope) {
//   if (!localValue.value) {
//     return false;
//   }
//   return scope.opt.values
//     .some((value) => value.name === localValue.value || value.value === localValue.value);
// }

function updateModelValue() {
  console.log('updateModelValue');
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
</script>
