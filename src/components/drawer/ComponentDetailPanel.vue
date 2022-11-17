<template>
  <q-drawer
    no-swipe-close
    bordered
    data-cy="object-details-panel"
    v-model="isVisible"
    side="right"
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
    <div class="col"
      v-if="selectedComponent && isVisible"
    >
      <q-form
        @submit="save"
        @reset="reset"
      >
        <q-input
          class="q-px-md q-pb-sm"
          :label="$t('plugin.component.attribute.name')"
          v-model="selectedComponentName"
        />
          <template
            v-for="localAttribute in localAttributes"
            :key="`${localAttribute.title}-${Math.random()}`"
          >

            <q-separator/>

            <q-expansion-item
              v-if="getSelectedComponentAttributes(localAttribute.attributeKey).length !== 0"
              :expand-separator="false"
              :default-opened="localAttribute.expanded"
              :label="$t(localAttribute.title)"
              class="text-bold"
            >

              <q-separator/>

              <q-item-section>
                <input-wrapper
                  v-for="attribute in getSelectedComponentAttributes(localAttribute.attributeKey)"
                  :key="`${attribute.name}-${Math.random()}`"
                  :attribute="attribute"
                  :plugin="localPlugin"
                  class="q-px-md q-pb-sm"
                  @update:attribute="(value) => attribute.value = value"
                />
              </q-item-section>
            </q-expansion-item>

            <q-separator/>

          </template>
        <div class="row justify-center q-mt-sm">
          <q-btn
            flat
            icon="fa-solid fa-floppy-disk"
            :label="$t('plugin.component.attribute.save')"
            type="submit"
            :loading="submitting"
            data-cy="object-details-panel-save-button"
          >
            <template v-slot:loading>
              <q-spinner-dots/>
            </template>
          </q-btn>
          <q-btn
            flat
            icon="fa-solid fa-arrow-rotate-left"
            :label="$t('plugin.component.attribute.reset')"
            type="reset"
            data-cy="object-details-panel-reset-button"
          />
        </div>
      </q-form>
    </div>
  </q-drawer>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import InputWrapper from 'components/inputs/InputWrapper';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getPlugins, getComponent } from 'src/composables/PluginManager';
import { ComponentAttribute } from 'leto-modelizer-plugin-core';

const localPlugin = ref(null);
const selectedComponent = ref({});
const selectedComponentName = ref('');
const selectedComponentAttributes = ref([]);
const localAttributes = ref([
  {
    title: 'plugin.component.attribute.referenced',
    attributeKey: 'referenced',
    expanded: true,
  },
  {
    title: 'plugin.component.attribute.unreferenced',
    attributeKey: 'unreferenced',
    expanded: true,
  },
]);
const isVisible = ref(false);
const submitting = ref(false);

let pluginEditSubscription;

/**
 * Update local component data and emit DrawEvent & RenderEvent events.
 */
function save() {
  submitting.value = true;
  selectedComponent.value.name = selectedComponentName.value;
  selectedComponent.value.attributes = selectedComponentAttributes.value
    .filter(({ value }) => value !== null && value !== '');

  PluginEvent.DrawEvent.next();
  PluginEvent.RenderEvent.next();

  submitting.value = false;
  isVisible.value = false;
}

/**
 * Get attribute corresponding to the given definition.
 * Create one with the given definition if not existing.
 * @param {Object} component - Component containing the available attributes.
 * @param {Object} definition - Definition of the attribute to get.
 * @return {ComponentAttribute} the wanted attribute if available otherwise a newly created one.
 */
function getAttribute(component, definition) {
  return component.attributes.find((attr) => attr.name === definition.name)
    || new ComponentAttribute({
      name: definition.name,
      type: definition.type,
      definition,
    });
}

/**
 * Get an array of attributes corresponding to the definedAttributes array.
 * @param {Object} component - Component containing the available attributes and all definitions.
 * @return {Array} an array of referenced attributes.
 */
function getReferencedAttributes(component) {
  return component.definition.definedAttributes.map((defAttr) => getAttribute(component, defAttr));
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
 * Get an array of attributes corresponding to the attribute key.
 * @param {String} key - Attribute key.
 * @return {Array} an array of attributes.
 */
function getSelectedComponentAttributes(key) {
  switch (key) {
    case 'referenced':
      return selectedComponentAttributes.value.filter(({ definition }) => !!definition);
    case 'unreferenced':
      return selectedComponentAttributes.value.filter(({ definition }) => !definition);
    default:
      return [];
  }
}

/**
 * Reset local values of name and attributes.
 */
function reset() {
  selectedComponentName.value = selectedComponent.value.name;
  selectedComponentAttributes.value = JSON.parse(JSON.stringify(
    getReferencedAttributes(selectedComponent.value)
      .concat(getUnreferencedAttributes(selectedComponent.value)),
  ));
}

/**
 * Display panel and init local values according to the received id.
 * @param {Object} id - Id of the component to display.
 */
function onEdit({ id }) {
  isVisible.value = true;

  const plugins = getPlugins();
  const component = plugins.reduce((acc, plugin) => {
    if (!acc) {
      const foundComponent = getComponent(id, plugin.components);

      if (foundComponent) {
        localPlugin.value = plugin;
        acc = foundComponent;
      }
    }

    return acc;
  }, null);

  selectedComponent.value = component;
  selectedComponentName.value = component.name;
  selectedComponentAttributes.value = JSON.parse(JSON.stringify(
    getReferencedAttributes(component)
      .concat(getUnreferencedAttributes(component)),
  ));
}

onMounted(() => {
  pluginEditSubscription = PluginEvent.EditEvent.subscribe(onEdit);
});

onUnmounted(() => {
  pluginEditSubscription.unsubscribe();
});
</script>
