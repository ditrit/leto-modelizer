<template>
  <q-card
    flat
    bordered
    class="component-definition-card"
    :data-cy="`component-definition-${definition.type}`"
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
import { getPluginByName, renderPlugin } from 'src/composables/PluginManager';
import { useRoute } from 'vue-router';
import PluginEvent from 'src/composables/events/PluginEvent';

const route = useRoute();
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
async function onClickItem() {
  const plugin = getPluginByName(props.pluginName);

  plugin.data.addComponent(props.definition);
  const files = await renderPlugin(props.pluginName, route.params.projectName);
  PluginEvent.RenderEvent.next(files);
}
</script>

<style scoped>
  .component-definition-type {
    word-break: break-all;
  }
</style>
