<template>
  <div class="row items-center">
    <template v-if="!attribute.definition">
      <q-input
        v-model="name"
        :label="$t('plugin.component.attribute.name')"
        class="col-4 q-px-md"
        @update:model-value="(event) => emit('update:attribute-name', event)"
      />
      <span>:</span>
    </template>
    <component
      :is="inputList[getAttributeType(attribute)]"
      :attribute="attribute"
      :plugin="plugin"
      class="col q-px-md"
      :label="getAttributeLabel(attribute)"
      @update:model-value="(event) => emit('update:attribute-value', event)"
      hide-bottom-space
    />
  </div>
</template>

<script setup>
import {
  ref,
  defineAsyncComponent,
} from 'vue';
import { useI18n } from 'vue-i18n';

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

const inputList = {
  Boolean: defineAsyncComponent(() => import('./BooleanInput')),
  String: defineAsyncComponent(() => import('./StringInput')),
  Number: defineAsyncComponent(() => import('./NumberInput')),
  Reference: defineAsyncComponent(() => import('./ReferenceInput')),
  Select: defineAsyncComponent(() => import('./SelectInput')),
};
const { t } = useI18n();

const name = ref(!props.attribute.definition ? props.attribute.name : '');

const emit = defineEmits(['update:attribute-name', 'update:attribute-value']);

/**
 * Get the type of the given attribute.
 * @param {Object} attribute - The given attribute.
 * @return {String} the corresponding type.
 */
function getAttributeType(attribute) {
  if (attribute.definition?.rules.values) {
    return 'Select';
  }

  return attribute.definition?.type || attribute.type;
}

/**
 * Get the label of the given attribute.
 * @param {Object} attribute - The given attribute.
 * @return {String} the corresponding label.
 */
function getAttributeLabel(attribute) {
  let label = t('plugin.component.attribute.value');

  if (attribute.definition) {
    label = attribute.name;
  } else if (getAttributeType(attribute) === 'Boolean') {
    label = '';
  }

  return label;
}
</script>
