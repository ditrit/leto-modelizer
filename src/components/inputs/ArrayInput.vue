<template>
  <q-select
    ref="arrayInput"
    v-model="localValue"
    use-input
    use-chips
    multiple
    :options="options"
    hide-dropdown-icon
    input-debounce="0"
    new-value-mode="add"
    :hint="$t('plugin.component.attribute.hint.array')"
    :rules="[
      (value) => isRequired($t, value, attribute.definition?.required),
    ]"
  >
    <template #option="{ opt }">
      <item-list
        :item="opt"
        @select-item="(value) => !localValue.includes(value) ? localValue.push(value) : null"
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

const arrayInput = ref(null);
const options = ref([]);
const { attribute, plugin } = toRefs(props);
const localValue = ref(attribute.value.value);
const defaultValues = ref(attribute.value.definition.rules.values || []);
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

watch(() => arrayInput.value, () => {
  if (arrayInput.value) {
    arrayInput.value.validate();
  }
});

watch(() => props.attribute, () => {
  if (props.attribute.value) {
    localValue.value = props.attribute.value;
  }

  if (arrayInput.value) {
    arrayInput.value.validate();
  }
});

watch(() => localValue.value, () => {
  emit('update:model-value', localValue.value);
}, { deep: true });

onMounted(() => {
  initOptions();
});
</script>
