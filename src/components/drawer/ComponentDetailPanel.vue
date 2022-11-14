<template>
  <q-drawer
    no-swipe-close
    bordered
    data-cy="object-details-panel"
    v-model="isVisible"
    side="right"
  >
    <div class="col"
      v-if="selectedComponent && isVisible"
    >
      <q-card flat>
        <q-card-actions align="right">
          <q-btn
            flat
            data-cy="object-details-panel-close-button"
            @click="isVisible = false"
            icon="fa-solid fa-xmark"
          />
        </q-card-actions>
        <q-card-section>
          <q-form>
            <q-input
              :label="$t('plugin.component.attribute.name')"
              v-model="selectedComponentName"
            />
            <input-wrapper
              v-for="attribute in selectedComponentAttributes"
              :key="`${attribute.name}-${Math.random()}`"
              :attribute="attribute"
              :plugin="localPlugin"
              @update:attribute="(value) => attribute.value = value"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="evenly">
          <q-btn
            flat
            icon="fa-solid fa-floppy-disk"
            @click="save"
            data-cy="object-details-panel-save-button"
            :label="$t('plugin.component.attribute.save')"
          />
          <q-btn
            flat
            @click="reset"
            data-cy="object-details-panel-reset-button"
            :label="$t('plugin.component.attribute.reset')"
            icon="fa-solid fa-arrow-rotate-left"
          />
        </q-card-actions>
      </q-card>
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
const isVisible = ref(false);

let pluginEditSubscription;

/**
 * Update local component data and emit DrawEvent & RenderEvent events.
 */
function save() {
  selectedComponent.value.name = selectedComponentName.value;
  selectedComponent.value.attributes = selectedComponentAttributes.value
    .filter(({ value }) => value !== null && value !== '');

  PluginEvent.DrawEvent.next();
  PluginEvent.RenderEvent.next();
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
 * Get an array of attributes corresponding the definedAttributes array.
 * @param {Object} component - Component containing the available attribute and all definitions.
 * @return {Array} an array of attributes.
 */
function getAttributes(component) {
  return component.definition.definedAttributes.map((defAttr) => getAttribute(component, defAttr));
}

/**
 * Reset local values of name and attributes.
 */
function reset() {
  selectedComponentName.value = selectedComponent.value.name;
  selectedComponentAttributes.value = JSON.parse(
    JSON.stringify(getAttributes(selectedComponent.value)),
  );
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
  selectedComponentAttributes.value = JSON.parse(JSON.stringify(getAttributes(component)));
}

onMounted(() => {
  pluginEditSubscription = PluginEvent.EditEvent.subscribe(onEdit);
});

onUnmounted(() => {
  pluginEditSubscription.unsubscribe();
});
</script>
