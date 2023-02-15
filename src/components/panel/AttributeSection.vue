<template>
  <input-wrapper
    v-if="!isObject"
    class="col"
    :attribute="localAttribute"
    :plugin="plugin"
    :full-name="fullName"
    @delete:attribute="deleteAttribute"
    @update:attribute-name="updateAttributeName"
    @update:attribute-value="updateAttributeValue"
  />
  <q-expansion-item
    v-else
    v-model="localAttribute.expanded"
    expand-icon-class="text-white"
    bordered
    class="rounded-borders shadow-1 col"
    :header-class="`${ !isRoot ? 'bg-secondary' : 'bg-primary'} text-white`"
    dense
  >
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon
          v-if="localAttribute.definition !== null"
          color="accent"
          name="fa-solid fa-lock"
          :title="$t('plugin.component.attribute.referenced')"
          size="xs"
        />
        <q-icon
          v-else
          color="accent"
          name="fa-solid fa-lock-open"
          :title="$t('plugin.component.attribute.unreferenced')"
          size="xs"
        />
      </q-item-section>
      <q-item-section>
        {{ localAttribute.definition?.displayName || localAttribute.name }}
      </q-item-section>
      <q-item-section v-if="hasError" side>
        <q-icon
          color="negative"
          name="fa-solid fa-circle-exclamation"
          size="xs"
          :title="$t('errors.plugin.object')"
        />
      </q-item-section>
    </template>
    <q-list>
      <q-item
        v-if="localAttribute.definition === null"
        class="q-px-none"
      >
        <q-input
          ref="stringInput"
          class="q-px-md q-pb-sm"
          v-model="localAttribute.name"
          :label="$t('plugin.component.attribute.section')"
          :rules="[
            (value) => isRequired($t, value, true),
          ]"
        />
      </q-item>
      <q-separator v-if="localAttribute.definition === null"/>
      <q-item
        v-for="subAttribute in getSubAttributes(localAttribute)
          .filter(({type}) => type !== 'Object')"
        :key="`${subAttribute.type}-${Math.random()}`"
        class="q-px-none"
      >
        <attribute-section
          :plugin="plugin"
          :attribute="subAttribute"
          :is-children="true"
          :class="subAttribute.type === 'Object' ? 'q-ml-sm' : ''"
          :full-name="`${fullName}.${subAttribute.name}`"
          :current-error="currentError"
          @update:attribute="updateAttribute"
        />
      </q-item>
      <q-item
        v-if="getSubAttributes(localAttribute).length === 0"
        class="text-grey text-weight-regular q-px-none justify-center"
      >
          {{ $t('plugin.component.attribute.noAttributes') }}
      </q-item>
      <q-item class="justify-center q-px-none">
        <q-btn
          no-caps
          :label="$t('plugin.component.attribute.add')"
          color="positive"
          icon="fa-solid fa-plus"
          data-cy="object-details-panel-attribute-add-button"
          @click="addSubAttribute"
        />
      </q-item>
      <q-item
        v-for="subAttribute in getSubAttributes(localAttribute)
          .filter(({type}) => type === 'Object')"
        :key="`${subAttribute.type}-${Math.random()}`"
        class="q-px-none"
      >
        <attribute-section
          :plugin="plugin"
          :attribute="subAttribute"
          :is-children="true"
          :full-name="`${fullName}.${subAttribute.name}`"
          :current-error="currentError"
          :class="subAttribute.type === 'Object' ? 'q-ml-sm' : ''"
          @update:attribute="updateAttribute"
        />
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import InputWrapper from 'components/inputs/InputWrapper';
import {
  isRequired,
} from 'src/composables/QuasarFieldRule';
import { ComponentAttribute } from 'leto-modelizer-plugin-core';

const props = defineProps({
  attribute: {
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
const isObject = computed(() => props.attribute.type === 'Object');
// TODO: update to reactive
const localAttribute = ref(props.attribute);
const emit = defineEmits([
  'add:attribute',
  'delete:attribute',
  'update:attribute',
]);
const hasError = computed(() => props.currentError !== null
  && props.currentError.indexOf(props.fullName) === 0);

/**
 * Get all sub-attributes of the provided attribute. Retrieve a list that contains instantiated
 * attributes from definitions.
 * @param {ComponentAttribute} attribute - Attribute.
 * @return {ComponentAttribute[]} List with all sub-attributes.
 */
function getSubAttributes(attribute) {
  const attributes = [];

  if (attribute.value?.length > 0) {
    attribute.value.forEach((attr) => attributes.push(attr));
  }

  attribute.definition?.definedAttributes
    ?.filter(({ name }) => !attributes.some((attr) => attr.name === name))
    .forEach((definition) => attributes.push(new ComponentAttribute({
      name: definition.name,
      type: definition.type,
      definition,
    })));

  return [
    ...attributes.filter(({ definition }) => definition !== null),
    ...attributes.filter(({ definition }) => definition === null),
  ];
}

/**
 * Add a new attribute without definition and emit event to update parent attribute.
 */
function addSubAttribute() {
  localAttribute.value.value.push({
    name: `attribute_${props.attribute.value.length + 1}`,
    value: '',
    definition: null,
    type: 'String',
  });

  emit('update:attribute', {
    name: props.attribute.name,
    attribute: localAttribute.value,
  });
}

/**
 * Emit event to the parent to delete attribute.
 */
function deleteAttribute() {
  emit('update:attribute', {
    name: props.attribute.name,
  });
}

/**
 * Update name of attribute and emit event to update parent attribute.
 * @param {String} newName - New attribute name.
 */
function updateAttributeName(newName) {
  const { name } = props.attribute;
  localAttribute.value.name = newName;

  emit('update:attribute', {
    name,
    attribute: localAttribute.value,
  });
}

/**
 * Update value of attribute and emit event to update parent attribute.
 * @param {String} newValue - New attribute value.
 */
function updateAttributeValue(newValue) {
  localAttribute.value.value = newValue;

  emit('update:attribute', {
    name: props.attribute.name,
    attribute: localAttribute.value,
  });
}

/**
 * Update attribute and emit event to update parent attribute.
 * If provided `event.attribute` is null, this will remove the attribute from the attributes list.
 * And if attribute's name doesn't exist in the list, it will add the attribute.
 * @param {Object} event - Event.
 * @param {String} event.name - Name of updated attribute.
 * @param {ComponentAttribute} event.attribute - New attribute value or null.
 */
function updateAttribute(event) {
  if (!event.attribute) {
    localAttribute.value.value = localAttribute.value.value
      .filter(({ name }) => name !== event.name);
  } else {
    const index = localAttribute.value.value.findIndex(({ name }) => event.name === name);

    if (index < 0) {
      localAttribute.value.value.push(event.attribute);
    } else {
      localAttribute.value.value[index] = event.attribute;
    }
  }

  emit('update:attribute', {
    name: props.attribute.name,
    attribute: localAttribute.value,
  });
}

watch(hasError, () => {
  localAttribute.value.expanded = hasError.value || localAttribute.value.expanded;
});

watch(() => props.attribute, () => {
  localAttribute.value = props.attribute;
});
</script>
