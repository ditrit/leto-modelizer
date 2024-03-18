<template>
  <q-expansion-item
    v-model="expanded"
    expand-icon-class="text-white"
    bordered
    class="rounded-borders shadow-1 col"
    :header-class="`${!isRoot ? 'bg-secondary' : 'bg-primary'} text-white`"
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
          color="negative"
          name="fa-solid fa-circle-exclamation"
          size="xs"
          :title="$t('errors.plugin.object')"
        />
      </q-item-section>
    </template>
    <div class="q-pa-md">
      <div
        v-if="attribute.value?.length === 0"
        class="no-objects-message"
      >
        No objects present yet, click on the button to add one!
      </div>
      <div
        v-for="(item, index) in attribute.value"
        :key="index"
      >
        <q-card class="object-card">
          <attributes-list
            :attributes="getSubAttributes(item)"
            :plugin="plugin"
            :component="component"
            :full-name="`${fullName}.${index}`"
            :current-error="currentError"
            @update:attributes="(event) => updateObject(index, event)"
          />
          <q-btn
            flat
            round
            color="negative"
            icon="fa-solid fa-trash-alt"
            class="object-delete-btn"
            @click="removeObject(index)"
          >
            <q-tooltip
              anchor="top left"
              self="bottom right"
            >
              Delete Object
            </q-tooltip>
          </q-btn>
        </q-card>
      </div>
      <q-btn
        flat
        round
        color="primary"
        icon="fa-solid fa-plus"
        class="q-mt-md"
        @click="addObject"
      >
        Add an Object
      </q-btn>
    </div>
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

/**
 * Adds a new object to the attribute's value.
 */
function addObject() {
  const objects = props.attribute.value || [];
  const objectDefinition = props.attribute.definition.itemDefinition[0];
  const newObj = props.component.createAttribute({
    name: objectDefinition.name,
    type: 'Object',
    definition: objectDefinition,
    value: [],
  });
  objects.push(newObj);
  emit('update:attribute-value', {
    attributeName: props.attribute.name,
    newValue: objects,
  });
}

/**
 * Updates the object at the specified index with the provided attributes.
 * @param {number} index - The index of the object to update.
 * @param {object} event - The event containing updated attributes.
 */
function updateObject(index, event) {
  const objects = props.attribute.value || [];
  objects[index].value = event.attributes.filter(({ definition, value }) => !definition || value);
  emit('update:attribute-value', {
    attributeName: props.attribute.name,
    newValue: objects,
  });
}

/**
 * Removes the object at the specified index.
 * @param {number} index - The index of the object to remove.
 */
function removeObject(index) {
  const objects = props.attribute.value || [];
  objects.splice(index, 1);
  emit('update:attribute-value', {
    attributeName: props.attribute.name,
    newValue: objects,
  });
}

watch(() => hasError.value, () => {
  expanded.value = hasError.value || expanded.value;
});
</script>

  <style scoped>
  .object-card {
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 8px;
  }
  .object-delete-btn {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
  .no-objects-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background-color: #F7F7F7;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    color: #888;
    padding: 16px;
    margin-bottom: 16px;
  }
  </style>
