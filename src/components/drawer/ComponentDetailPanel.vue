<template>
  <q-drawer
    v-model="isVisible"
    no-swipe-close
    bordered
    side="right"
    :width="350"
    data-cy="object-details-panel"
  >
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label
            overline
            header
          >
            {{ $t('plugin.component.attribute.title') }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            round
            flat
            icon="fa-solid fa-xmark"
            data-cy="close-button"
            @click="isVisible = false"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <div
      v-if="originalComponent && isVisible"
      class="col"
    >
      <q-form
        ref="form"
        greedy
        @validation-error="onError"
        @validation-success="clearError"
      >
        <attributes-list
          :attributes="selectedComponentAttributes"
          :component="originalComponent"
          :plugin="plugin"
          :is-root="true"
          :full-name="'root'"
          :current-error="currentError"
          @update:attributes="updateAttributes"
        >
          <template #header>
            <!-- Selected component name -->
            <q-item class="q-px-none">
              <q-input
                v-model="selectedComponentId"
                class="q-px-md q-pb-sm"
                :label="$t('plugin.component.attribute.id')"
                data-cy="component-id-input"
                @update:model-value="submit"
              />
            </q-item>
          </template>
        </attributes-list>
      </q-form>
    </div>
  </q-drawer>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import { renderModel } from 'src/composables/PluginManager';
import { useRoute } from 'vue-router';
import AttributesList from 'src/components/inputs/AttributesList.vue';

const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
});

const selectedComponentId = ref('');
const selectedComponentAttributes = ref([]);
const isVisible = ref(false);
const submitting = ref(false);
const currentError = ref(null);
const form = ref(null);
const route = useRoute();
const query = computed(() => route.query);
const originalComponent = ref(null);
const attributesUpdated = ref([]);

let pluginDefaultSubscription;

/**
 * Return the array of attributes with only needed attributes.
 * @param {Array} attributes - Array of attribute to sanitize.
 * @returns {Array} Sanitized array.
 */
function sanitizeAttributes(attributes) {
  return attributes.reduce((acc, attribute) => {
    if (attribute.value !== undefined && attribute.value !== null && attribute.value !== '') {
      if (attribute.type !== 'Object') {
        acc.push(originalComponent.value.createAttribute(attribute));
      } else {
        const sanitizedValue = sanitizeAttributes(attribute.value);

        if (sanitizedValue.length !== 0) {
          acc.push(originalComponent.value.createAttribute({
            ...attribute,
            value: sanitizedValue,
          }));
        }
      }
    }
    return acc;
  }, []);
}

/**
 * Update component data, redraw model and render files.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function submit() {
  submitting.value = true;

  if (originalComponent.value.id !== selectedComponentId.value) {
    props.plugin.data.renameComponentId(originalComponent.value.id, selectedComponentId.value);
  }

  originalComponent.value.attributes = sanitizeAttributes(attributesUpdated.value);

  props.plugin.draw('root');

  await renderModel(
    route.params.projectName,
    query.value.path,
    props.plugin,
  );

  submitting.value = false;
}

/**
 * Get type of component value from definition type.
 * Can be possibly different from component type given in definition.
 * @param {ComponentAttributeDefinition} definition - Component attribute definition.
 * @returns {string} Type of attribute.
 */
function getComponentValueType(definition) {
  if (definition.type === 'Link') {
    return 'Array';
  }
  if (definition.type === 'Reference') {
    return 'String';
  }
  return definition.type;
}

/**
 * Get attribute corresponding to the given definition.
 * Create one with the given definition if not existing.
 * @param {Component} component - Component containing the available attributes.
 * @param {ComponentAttributeDefinition} definition - Definition of the attribute to get.
 * @returns {ComponentAttribute} the wanted attribute if available otherwise a newly created one.
 */
function getAttributeByDefinition(component, definition) {
  return component.attributes.find((attr) => attr.name === definition.name)
    || component.createAttribute({
      name: definition.name,
      type: getComponentValueType(definition),
      definition,
      value: definition.type === 'Object' ? [] : null,
    });
}

/**
 * Get an array of attributes corresponding to the definedAttributes array.
 * @param {object} component - Component containing the available attributes and all definitions.
 * @returns {Array} an array of referenced attributes.
 */
function getReferencedAttributes(component) {
  return component.definition.definedAttributes
    .map((defAttr) => getAttributeByDefinition(component, defAttr));
}

/**
 * Get an array of attributes corresponding to the attributes without definition.
 * @param {object} component - Component containing the available attributes.
 * @returns {Array} an array of unreferenced attributes.
 */
function getUnreferencedAttributes(component) {
  return component.attributes
    .filter((attr) => attr.definition === null);
}

/**
 * On 'Drawer' event type and 'select' action, display panel and init local values.
 * On 'Drawer' event type and 'delete' action, hide panel if component is corresponding.
 * @param {object} eventManager - Object containing event and plugin.
 * @param {object} eventManager.event - The triggered event.
 */
function onDefaultEvent({ event }) {
  if (event.components?.[0] && event.type === 'Drawer') {
    if (event.action === 'select') {
      isVisible.value = true;

      originalComponent.value = props.plugin.data.getComponentById(event.components[0]);

      selectedComponentId.value = originalComponent.value.id;
      selectedComponentAttributes.value = JSON.parse(JSON.stringify(
        getReferencedAttributes(originalComponent.value)
          .concat(getUnreferencedAttributes(originalComponent.value)),
      ));
      attributesUpdated.value = [...selectedComponentAttributes.value];
    } else if (event.action === 'delete' && event.components?.[0] === originalComponent.value.id) {
      isVisible.value = false;
    }
  }
}

/**
 * Update attribute.
 * If provided `event.attribute` is null, this will remove the attribute from the attributes list.
 * And if attribute's name doesn't exist in the list, it will add the attribute.
 * @param {object} event - Form event.
 * @param {string} event.name - Name of updated attribute.
 * @param {ComponentAttribute} event.attributes - New attribute value or null.
 */
function updateAttributes(event) {
  attributesUpdated.value = [...event.attributes];
  submit();
}

/**
 * Set currentError to full-name attribute value of field in error.
 * @param {object} event - Form event.
 */
function onError(event) {
  currentError.value = event?.nativeEl?.getAttribute('full-name') || null;
}

/**
 * Set currentError value to null.
 */
function clearError() {
  currentError.value = null;
}

onMounted(() => {
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe(onDefaultEvent);
});

onUnmounted(() => {
  pluginDefaultSubscription.unsubscribe();
});
</script>
