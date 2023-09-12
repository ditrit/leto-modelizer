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

const arrayInput = ref(null);
const options = ref([]);
const { attribute, plugin } = toRefs(props);
const localValue = ref(attribute.value.value);
const defaultValues = ref(attribute.value.definition.rules.values || []);
const variables = ref(plugin.value.data.variables || []);

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
  options.value = initSelectOptions(variables.value, defaultValues.value);
});
</script>
