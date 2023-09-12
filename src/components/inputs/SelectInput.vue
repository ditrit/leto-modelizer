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

const selectInput = ref(null);
const { attribute, plugin } = toRefs(props);
const localValue = ref(attribute.value.value);
const options = ref([]);
const defaultValues = ref(attribute.value.definition.rules.values);
const variables = ref(plugin.value.data.variables || []);

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
  options.value = initSelectOptions(variables.value, defaultValues.value);
});
</script>
