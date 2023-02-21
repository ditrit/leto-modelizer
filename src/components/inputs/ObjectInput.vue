<template>
  <q-expansion-item
    v-model="expanded"
    expand-icon-class="text-white"
    bordered
    class="rounded-borders shadow-1 col"
    :header-class="`${ !isRoot ? 'bg-secondary' : 'bg-primary'} text-white`"
    dense
  >
    <template #header>
      <q-item-section avatar>
        <q-icon
          v-if="attribute.definition !== null"
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
        {{ attribute.definition?.displayName || attribute.name }}
      </q-item-section>
      <q-item-section
        v-if="hasError"
        side
      >
        <q-icon
          color="warning"
          name="fa-solid fa-circle-exclamation"
          size="xs"
          :title="$t('errors.plugin.object')"
        />
      </q-item-section>
    </template>
    <attributes-list
      :attributes="getSubAttributes(attribute)"
      :component="component"
      :plugin="plugin"
      :full-name="fullName"
      :current-error="currentError"
      @update:attributes="(event) => emit('update:attribute-value', {
        attributeName: attribute.name,
        newValue: event.attributes,
      })"
    />
  </q-expansion-item>
</template>

<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue';
import AttributesList from 'src/components/inputs/AttributesList.vue';

const emit = defineEmits([
  'update:attribute-value',
]);

const props = defineProps({
  attribute: {
    type: Object,
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

const expanded = ref(false);
const hasError = computed(() => props.currentError?.startsWith(`${props.fullName}.`));

/**
 * Get all sub-attributes of the provided attribute. Retrieve a list that contains instantiated
 * attributes from definitions.
 * @param {ComponentAttribute} attribute - Attribute.
 * @returns {ComponentAttribute[]} List with all sub-attributes.
 */
function getSubAttributes(attribute) {
  const attributes = [];
  const attributeValue = attribute.value || [];

  attribute.definition?.definedAttributes
    ?.forEach((definition) => {
      const attr = attributeValue.find(({ name }) => name === definition.name);

      if (attr) {
        attributes.push(attr);
      } else {
        attributes.push(props.component.createAttribute({
          name: definition.name,
          type: definition.type,
          definition,
        }));
      }
    });

  return [
    ...attributes,
    ...attributeValue.filter(({ definition }) => !definition),
  ];
}

watch(() => hasError.value, () => {
  expanded.value = hasError.value || expanded.value;
});
</script>
