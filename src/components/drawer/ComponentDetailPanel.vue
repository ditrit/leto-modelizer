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
              />
            </q-item>
          </template>
          <template #footer>
            <!-- Action SelectedComponent -->
            <q-item>
              <q-checkbox
                v-model="forceSave"
                :label="$t('plugin.component.attribute.forceSave')"
              />
            </q-item>
            <q-item class="row justify-evenly q-mt-md">
              <q-btn
                icon="fa-solid fa-floppy-disk"
                :label="$t('plugin.component.attribute.save')"
                type="button"
                color="positive"
                :loading="submitting"
                data-cy="save-button"
                @click="save"
              >
                <template #loading>
                  <q-spinner-dots />
                </template>
              </q-btn>
              <q-btn
                icon="fa-solid fa-arrow-rotate-left"
                :label="$t('plugin.component.attribute.reset')"
                color="info"
                data-cy="reset-button"
                @click="reset"
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
import { ComponentAttribute } from 'leto-modelizer-plugin-core';
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
const forceSave = ref(false);
const route = useRoute();
const query = computed(() => route.query);
const originalComponent = ref(null);
const attributesUpdated = ref([]);

let pluginDefaultSubscription;

/**
 * Return the array of attributes with only needed attributes.
 * @param {Array} attributes - Array of attribute to sanitize.
 * @return {Array} Sanitized array.
 */
function sanitizeAttributes(attributes) {
  return attributes.reduce((acc, attribute) => {
    if (attribute.value !== undefined && attribute.value !== null && attribute.value !== '') {
      if (attribute.type !== 'Object') {
        acc.push(new ComponentAttribute(attribute));
      } else {
        const sanitizedValue = sanitizeAttributes(attribute.value);

        if (sanitizedValue.length !== 0) {
          acc.push(new ComponentAttribute({
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
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function submit() {
  submitting.value = true;

  originalComponent.value.id = selectedComponentId.value;
  originalComponent.value.attributes = sanitizeAttributes(attributesUpdated.value);

  props.plugin.draw('root');

  const path = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/${query.value.path}`
    : `${query.value.path}`;

  await renderModel(
    route.params.projectName,
    path,
    props.plugin,
  );

  submitting.value = false;
  isVisible.value = false;
  forceSave.value = false;
}

/**
 * Handle form validation.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function save() {
  return form.value.validate().then((success) => {
    if (forceSave.value || success) {
      return submit();
    }
    return Promise.resolve();
  });
}

/**
 * Get attribute corresponding to the given definition.
 * Create one with the given definition if not existing.
 * @param {Component} component - Component containing the available attributes.
 * @param {ComponentAttributeDefinition} definition - Definition of the attribute to get.
 * @return {ComponentAttribute} the wanted attribute if available otherwise a newly created one.
 */
function getAttributeByDefinition(component, definition) {
  return component.attributes.find((attr) => attr.name === definition.name)
    || new ComponentAttribute({
      name: definition.name,
      type: definition.type,
      definition,
      value: definition.type === 'Object' ? [] : null,
    });
}

/**
 * Get an array of attributes corresponding to the definedAttributes array.
 * @param {Object} component - Component containing the available attributes and all definitions.
 * @return {Array} an array of referenced attributes.
 */
function getReferencedAttributes(component) {
  return component.definition.definedAttributes
    .map((defAttr) => getAttributeByDefinition(component, defAttr));
}

/**
 * Get an array of attributes corresponding to the attributes without definition.
 * @param {Object} component - Component containing the available attributes.
 * @return {Array} an array of unreferenced attributes.
 */
function getUnreferencedAttributes(component) {
  return component.attributes
    .filter((attr) => attr.definition === null);
}

/**
 * Reset local values of name and attributes.
 */
function reset() {
  selectedComponentId.value = originalComponent.value.id;
  selectedComponentAttributes.value = JSON.parse(JSON.stringify(
    getReferencedAttributes(originalComponent.value)
      .concat(getUnreferencedAttributes(originalComponent.value)),
  ));
  attributesUpdated.value = [...selectedComponentAttributes.value];

  forceSave.value = false;
}

/**
 * On 'Drawer' event type and 'select' action, display panel and init local values.
 * @param {Object} eventManager - Object containing event and plugin.
 * @param {Object} eventManager.event - The triggered event.
 */
function setLocalValues({ event }) {
  if (!event.components || !event.components[0]) {
    return;
  }

  if (event.type === 'Drawer' && event.action === 'select') {
    isVisible.value = true;

    originalComponent.value = props.plugin.data.getComponentById(event.components[0]);

    selectedComponentId.value = originalComponent.value.id;
    selectedComponentAttributes.value = JSON.parse(JSON.stringify(
      getReferencedAttributes(originalComponent.value)
        .concat(getUnreferencedAttributes(originalComponent.value)),
    ));
    attributesUpdated.value = [...selectedComponentAttributes.value];
  }
}

/**
 * Update attribute.
 * If provided `event.attribute` is null, this will remove the attribute from the attributes list.
 * And if attribute's name doesn't exist in the list, it will add the attribute.
 * @param {Object} event - Event.
 * @param {String} event.name - Name of updated attribute.
 * @param {ComponentAttribute} event.attribute - New attribute value or null.
 */
function updateAttributes(event) {
  attributesUpdated.value = [...event.attributes];
}

/**
 * Set currentError to full-name attribute value of field in error.
 * @param {Object} event - Form event.
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
  pluginDefaultSubscription = PluginEvent.DefaultEvent.subscribe(setLocalValues);
});

onUnmounted(() => {
  pluginDefaultSubscription.unsubscribe();
});
</script>
