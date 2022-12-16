<template>
  <q-card
    flat
    bordered
    class="component-definition-card"
  >
    <q-item
      clickable
      @click="onClickItem"
      class="column q-pl-xs q-pr-xs items-center"
    >
      <q-item-section
        v-if="definition.icon"
        avatar
        class="items-center q-pr-none"
      >
        <q-icon
          color="primary"
          size="xl"
          :name="`img:/plugins/${pluginName}/icons/${definition.icon}.svg`"
        >
        </q-icon>
      </q-item-section>

      <q-item-section>
        <q-item-label class="component-definition-type">
          {{ definition.type }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
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
  const id = `${props.definition.type}_${randomHexString(8)}`;

  plugin.data.addComponent(id, props.definition);
  plugin.draw('root');
}
</script>

<style scoped>
  .component-definition-type {
    word-break: break-all;
  }
</style>
