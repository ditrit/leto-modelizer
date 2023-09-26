<template>
  <div
    class="row items-center"
  >
    <template v-if="!attribute.definition">
      <q-input
        v-model="name"
        :label="$t('plugin.component.attribute.name')"
        class="col-4 q-px-md"
        @update:model-value="(event) => emit('update:attribute-name', {
          attributeName: attribute.name,
          newName: event,
        })"
      />
      <span class="text-subtitle1">=</span>
    </template>
    <template v-else-if="attribute.definition.description || attribute.definition.url">
      <q-icon
        name="fa-solid fa-circle-info"
        color="info"
        size="xs"
        class="q-ml-sm self-start"
        style="cursor: help"
      >
        <definition-menu
          :definition="attribute.definition"
          :is-attribute="true"
          :offset="[100, 15]"
        />
      </q-icon>
    </template>
    <component
      :is="inputList[getAttributeType(attribute)]"
      :attribute="attribute"
      :plugin="plugin"
      class="col q-px-md"
      :label="getAttributeLabel(attribute) || $t('plugin.component.attribute.value')"
      hide-bottom-space
      :full-name="fullName"
      @update:model-value="(event) => emit('update:attribute-value', {
        attributeName: attribute.name,
        newValue: event,
      })"
    />
    <q-btn
      v-if="!attribute.definition"
      class="q-mr-md"
      size="xs"
      round
      flat
      color="negative"
      icon="fa-solid fa-trash"
      data-cy="delete-attribute-button"
      @click="emit('delete:attribute')"
    >
      <q-tooltip
        anchor="center left"
        self="center right"
      >
        {{ $t('plugin.component.attribute.delete') }}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import {
  ref,
  defineAsyncComponent,
  watch,
  toRef,
} from 'vue';
import DefinitionMenu from 'components/menu/DefinitionMenu.vue';

const props = defineProps({
  attribute: {
    type: Object,
    required: true,
  },
  plugin: {
    type: Object,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
});

const inputList = {
  Boolean: defineAsyncComponent(() => import('./BooleanInput')),
  String: defineAsyncComponent(() => import('./StringInput')),
  Number: defineAsyncComponent(() => import('./NumberInput')),
  Reference: defineAsyncComponent(() => import('./ReferenceInput')),
  Select: defineAsyncComponent(() => import('./SelectInput')),
  Link: defineAsyncComponent(() => import('./LinkInput')),
  Array: defineAsyncComponent(() => import('./ArrayInput')),
};

const propsAttribute = toRef(props, 'attribute');
const name = ref(!propsAttribute.value.definition ? propsAttribute.value.name : '');

const emit = defineEmits([
  'update:attribute-name',
  'update:attribute-value',
  'delete:attribute',
]);

/**
 * Get the type of the given attribute.
 * @param {object} attribute - The given attribute.
 * @returns {string} the corresponding type.
 */
function getAttributeType(attribute) {
  if (attribute.definition?.rules.values && attribute.definition?.type !== 'Array') {
    return 'Select';
  }

  return attribute.definition?.type || attribute.type;
}

/**
 * Get the label of the given attribute.
 * @param {object} attribute - The given attribute.
 * @returns {string} the corresponding label.
 */
function getAttributeLabel(attribute) {
  let label = null;

  if (attribute.definition) {
    label = attribute.definition.displayName || attribute.name;
  } else if (getAttributeType(attribute) === 'Boolean') {
    label = '';
  }

  return label;
}

watch(() => props.attribute, () => {
  name.value = !props.attribute.definition ? props.attribute.name : '';
});
</script>
