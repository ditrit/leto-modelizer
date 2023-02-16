<template>
  <q-drawer
    v-model="isVisible"
    no-swipe-close
    bordered
    data-cy="object-details-panel"
    side="right"
    :width="350"
  >
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label overline header>
            {{ $t('plugin.component.attribute.title') }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            round
            flat
            icon="fa-solid fa-xmark"
            data-cy="object-details-panel-close-button"
            @click="isVisible = false"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <div
       v-if="selectedComponent && isVisible"
       class="col"
    >
      <q-form
        ref="form"
        @reset="reset"
        @validation-error="onError"
        @validation-success="clearError"
      >
        <q-list>
          <q-item class="q-px-none">
            <q-input
              v-model="selectedComponentId"
              class="q-px-md q-pb-sm"
              :label="$t('plugin.component.attribute.id')"
            />
          </q-item>
          <q-item
            v-for="attribute in selectedComponentAttributes.filter(({ type }) => type !== 'Object')"
            :key="`${attribute.title}-${Math.random()}`"
            class="q-px-none"
          >
            <attribute-section
              :attribute="attribute"
              :plugin="localPlugin"
              :is-root="true"
              :full-name="attribute.name"
              :current-error="currentError"
              @add:attribute="addAttribute"
              @update:attribute="updateAttribute"
            />
          </q-item>
          <q-item
            v-if="selectedComponentAttributes.filter(({ type }) => type !== 'Object').length === 0"
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
              @click="addAttribute"
            />
          </q-item>
          <q-item
            v-for="attribute in selectedComponentAttributes.filter(({ type }) => type === 'Object')"
            :key="`${attribute.title}-${Math.random()}`"
            class="q-pa-none"
            dense
          >
            <attribute-section
              :attribute="attribute"
              :plugin="localPlugin"
              :is-root="true"
              :full-name="attribute.name"
              :current-error="currentError"
              @add:attribute="addAttribute"
              @update:attribute="updateAttribute"
            />
          </q-item>
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
              type="submit"
              color="positive"
              :loading="submitting"
              @click="save"
              data-cy="object-details-panel-save-button"
            >
              <template v-slot:loading>
                <q-spinner-dots/>
              </template>
            </q-btn>
            <q-btn
              icon="fa-solid fa-arrow-rotate-left"
              :label="$t('plugin.component.attribute.reset')"
              type="reset"
              color="info"
              data-cy="object-details-panel-reset-button"
            />
          </q-item>
        </q-list>
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
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import { renderModel } from 'src/composables/PluginManager';
import { ComponentAttribute } from 'leto-modelizer-plugin-core';
import { useRoute } from 'vue-router';
import AttributeSection from 'components/panel/AttributeSection';

const props = defineProps({
  plugin: {
    type: Object,
    required: true,
  },
});

const localPlugin = ref(null);
const selectedComponent = ref({});
const selectedComponentId = ref('');
const selectedComponentAttributes = ref([]);
const isVisible = ref(false);
const submitting = ref(false);
const currentError = ref(null);
const form = ref(null);
const forceSave = ref(false);
const route = useRoute();
const query = computed(() => route.query);

let pluginEditSubscription;
let viewSwitchSubscription;

/**
 * Update local component data and emit DrawEvent & RenderEvent events.
 */
async function submit() {
  submitting.value = true;
  selectedComponent.value.id = selectedComponentId.value;
  selectedComponent.value.attributes = selectedComponentAttributes.value
    .filter(({ value }) => value !== null && value !== '');

  const path = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/${query.value.path}`
    : `${query.value.path}`;

  const files = await renderModel(
    route.params.projectName,
    path,
    localPlugin.value,
  );

  PluginEvent.RenderEvent.next(files);
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
  selectedComponentId.value = selectedComponent.value.id;
  selectedComponentAttributes.value = JSON.parse(JSON.stringify([
    ...getReferencedAttributes(selectedComponent.value),
    ...getUnreferencedAttributes(selectedComponent.value),
  ]));
  forceSave.value = false;
}

/**
 * Display panel and init local values according to the received id.
 * @param {Object} id - Id of the component to display.
 */
function onEdit({ id }) {
  isVisible.value = true;

  localPlugin.value = props.plugin;
  const component = props.plugin.data.getComponentById(id);

  selectedComponent.value = component;
  selectedComponentId.value = component.id;
  selectedComponentAttributes.value = JSON.parse(JSON.stringify(
    getReferencedAttributes(component)
      .concat(getUnreferencedAttributes(component)),
  ));
}

/**
 * Add a new attribute without definition.
 */
function addAttribute() {
  selectedComponentAttributes.value.push({
    name: `attribut_${selectedComponentAttributes.value.length + 1}`,
    value: '',
    definition: null,
    type: 'String',
  });
}

/**
 * Update attribute.
 * If provided `event.attribute` is null, this will remove the attribute from the attributes list.
 * And if attribute's name doesn't exist in the list, it will add the attribute.
 * @param {Object} event - Event.
 * @param {String} event.name - Name of updated attribute.
 * @param {ComponentAttribute} event.attribute - New attribute value or null.
 */
function updateAttribute(event) {
  if (!event.attribute) {
    selectedComponentAttributes.value = selectedComponentAttributes.value
      .filter(({ name }) => name !== event.name);
  } else {
    const index = selectedComponentAttributes.value.findIndex(({ name }) => event.name === name);

    if (index < 0) {
      selectedComponentAttributes.value.push(event.attribute);
    } else {
      selectedComponentAttributes.value[index] = event.attribute;
    }
  }
  form.value.validate(false);
}

/**
 * Close component detail panel if route is updated with a new view type.
 * @param {String} newViewType - Updated view type.
 */
function onViewSwitchUpdate(newViewType) {
  if (newViewType !== route.params.viewType) {
    isVisible.value = false;
  }
}

/**
 * Set currentError to full-name attribute value of field in error.
 * @param {Object} event - Form event.
 */
function onError(event) {
  if (event) {
    currentError.value = event.nativeEl.getAttribute('full-name');
  }
}

/**
 * Set currentError value to null.
 */
function clearError() {
  currentError.value = null;
}

onMounted(() => {
  pluginEditSubscription = PluginEvent.EditEvent.subscribe(onEdit);
  viewSwitchSubscription = ViewSwitchEvent.subscribe(onViewSwitchUpdate);
});

onUnmounted(() => {
  pluginEditSubscription.unsubscribe();
  viewSwitchSubscription.unsubscribe();
});
</script>
