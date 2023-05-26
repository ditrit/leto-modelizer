<template>
  <q-page>
    <div class="row q-gutter-md q-ma-md">
      <q-card
        v-for="diagram in diagrams"
        :key="`diagram_${diagram.name}`"
        class="diagram-container col-2 no-shadow q-pa-md bg-grey-3"
      >
        <div
          :id="`diagram_${diagram.name}`"
          :data-cy="`diagram_${diagram.name}`"
          @dragover.prevent
          @drop.prevent="dropHandler"
        />
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { getPluginByName, initComponents } from 'src/composables/PluginManager';
import { getAllModels } from 'src/composables/Project';
import {
  computed,
  onMounted,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const projectName = computed(() => route.params.projectName);
const diagrams = ref([]);
const defaultFolder = ref(process.env.MODELS_DEFAULT_FOLDER !== ''
  ? `${process.env.MODELS_DEFAULT_FOLDER}/`
  : '');

/**
 * Update diagrams list.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateDiagrams() {
  diagrams.value = await getAllModels(projectName.value);
}

/**
 * Draw read-only diagrams.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function drawDiagrams() {
  return Promise.allSettled(
    diagrams.value.map(async (diagram) => {
      const plugin = getPluginByName(diagram.plugin);

      return initComponents(
        projectName.value,
        plugin,
        `${defaultFolder.value}${diagram.plugin}/${diagram.name}`,
      ).then(() => {
        plugin.draw(`diagram_${diagram.name}`, true);
      });
    }),
  );
}

onMounted(async () => {
  await updateDiagrams();
  await drawDiagrams();
});
</script>

<style lang="scss" scoped>
.diagram-container {
  display: inline-block;
  border: 2px dashed $primary;
}
</style>
<style lang="scss">
// Quasar sets overflow to 'hidden' on all svg.
// In our case, it needs to be set to 'visible' to manage position with % in plugin models.
.diagram-container div svg {
    overflow: visible !important;
    display: unset;
    height: 100%;
    width: 100%;
  }
</style>
