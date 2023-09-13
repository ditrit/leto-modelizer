<template>
  <q-list data-cy="attributes-list">
    <slot name="header" />
    <!-- Attributes not Object -->
    <q-item
      v-for="attribute in data.localAttributes.filter(({ type }) => type !== 'Object')"
      :key="attribute.name"
      class="q-px-sm column"
    >
      <input-wrapper
        class="col"
        :attribute="attribute"
        :plugin="plugin"
        :full-name="`${fullName}.${attribute.name}`"
        @delete:attribute="deleteAttribute({ attribute })"
        @update:attribute-value="updateAttributeValue"
        @update:attribute-name="updateAttributeName"
      />
    </q-item>
    <!-- NO Attributes not Object message -->
    <q-item
      v-if="!data.localAttributes.some(({ type }) => type !== 'Object')"
      class="text-grey text-weight-regular q-px-none justify-center"
    >
      {{ $t('plugin.component.attribute.noAttributes') }}
    </q-item>
    <!-- Add attribute Button -->
    <q-item class="justify-center q-px-none">
      <q-btn
        no-caps
        :label="$t('plugin.component.attribute.add')"
        color="positive"
        icon="fa-solid fa-plus"
        data-cy="add-button"
        @click="addAttribute"
      />
    </q-item>
    <!-- Attributes Object -->
    <q-item
      v-for="attribute in data.localAttributes.filter(({ type }) => type === 'Object')"
      :key="attribute.name"
      class="q-pa-none"
      dense
    >
      <object-input
        :attribute="attribute"
        :component="component"
        :plugin="plugin"
        :is-root="isRoot"
        :full-name="`${fullName}.${attribute.name}`"
        :current-error="currentError"
        @update:attribute-value="updateAttributeValue"
      />
    </q-item>
    <slot name="footer" />
  </q-list>
</template>

<script setup>
import { reactive, toRef, watch } from 'vue';
import InputWrapper from 'components/inputs/InputWrapper';
import ObjectInput from 'src/components/inputs/ObjectInput.vue';

const emit = defineEmits([
  'update:attributes',
]);

const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  component: {
    type: Object,
    required: true,
  },
  plugin: {
    type: Object,
    required: true,
  },
  isRoot: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String,
    required: true,
  },
  currentError: {
    type: String,
    default: null,
  },
});

const data = reactive({
  localAttributes: [...toRef(props, 'attributes').value],
});

/**
 * Get a name for a new attribute.
 * @param {number} [index] - Incrementale number used if not already existing.
 * @returns {string} Name for a new attribute.
 */
function getNewAttributeName(index = 1) {
  const newName = `attribute_${index}`;

  if (data.localAttributes.find(({ name }) => name === newName)) {
    return getNewAttributeName(index + 1);
  }

  return newName;
}

/**
 * Add a new attribute without definition and emit event to update parent attributes list.
 */
function addAttribute() {
  data.localAttributes.push({
    name: getNewAttributeName(),
    value: '',
    definition: null,
    type: 'String',
  });

  emit('update:attributes', {
    attributes: data.localAttributes,
  });
}

/**
 * Update name of attribute and emit event to update parent attributes list.
 * @param {object} event - Form event.
 * @param {string} event.newName - New attribute name.
 * @param {string} event.attributeName - Old attribute name.
 */
function updateAttributeName(event) {
  const index = data.localAttributes.findIndex(({ name }) => name === event.attributeName);

  data.localAttributes.splice(
    index,
    1,
    {
      ...data.localAttributes[index],
      name: event.newName,
    },
  );

  emit('update:attributes', {
    attributes: data.localAttributes,
  });
}

/**
 * Update value of attribute and emit event to update parent attributes list.
 * @param {object} event - Form event.
 * @param {string} event.newValue - New attribute value.
 * @param {string} event.attributeName - Old attribute name.
 */
function updateAttributeValue(event) {
  const index = data.localAttributes.findIndex(({ name }) => name === event.attributeName);

  data.localAttributes.splice(
    index,
    1,
    {
      ...data.localAttributes[index],
      value: event.newValue,
    },
  );

  emit('update:attributes', {
    attributes: data.localAttributes,
  });
}

/**
 * Delete attribute and emit event to update parent attributes list.
 * @param {object} event - Form event.
 * @param {object} event.attribute - Attribute to delete.
 */
function deleteAttribute({ attribute }) {
  data.localAttributes.splice(data.localAttributes.indexOf(attribute), 1);

  emit('update:attributes', {
    attributes: data.localAttributes,
  });
}

watch(() => props.attributes, () => {
  data.localAttributes = [...props.attributes];
});
</script>
