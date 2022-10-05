<template>
  <q-card flat bordered class="component-definition-card">
    <q-item clickable
      @click="onClickItem"
    >
      <q-item-section avatar v-if="definition.icon">
        <q-icon
          color="primary"
          :name="`img:/plugins/${pluginName}/icons/${definition.icon}.svg`"
        >
        </q-icon>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ definition.type }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import { Component } from 'leto-modelizer-plugin-core';
import { getPluginByName } from 'src/composables/PluginManager';
import { randomHexString } from 'src/composables/Random';

const props = defineProps({
  definition: {
    type: Object,
    required: true,
  },
  pluginName: {
    type: String,
    required: true,
  },
});

/**
 * On definition click, add a new component to the plugin components
 * and draw them all.
 */
function onClickItem() {
  const plugin = getPluginByName(props.pluginName);
  const id = `object_${randomHexString(8)}`;
  plugin.components.push(new Component({
    definition: { ...props.definition },
    id,
    name: id,
  }));
  plugin.drawer.draw(plugin.components);
}
</script>
