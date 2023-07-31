<template>
  <q-page
    id="diagrams-page"
    v-touch-pan.mouse="handlePan"
    data-cy="diagrams-page"
    @click="selectDiagram()"
  >
    <div
      id="diagrams-container"
      class="row q-gutter-md q-ma-md"
    >
      <q-card
        v-for="diagram in diagrams"
        :key="`diagram_${diagram.path}`"
        :class="[
          'diagram-container',
          { selected: diagram.path === selectedDiagram?.path },
          'col-2',
          'no-shadow',
          'q-pa-md',
          'bg-grey-3',
        ]"
        :data-cy="`diagram-card_${diagram.path}`"
        @click.stop="selectDiagram(diagram)"
      >
        <div
          :id="diagram.id"
          :data-cy="`diagram_${diagram.path}`"
        />
        <q-popup-proxy>
          <q-btn-group>
            <q-btn
              stack
              size="sm"
              icon="fa-solid fa-trash"
              :label="$t('page.diagrams.actions.delete')"
              data-cy="delete-button"
              @click="deleteDiagram(diagram)"
            />
          </q-btn-group>
        </q-popup-proxy>
      </q-card>
    </div>
    <q-page-sticky :offset="[20, 20]">
      <q-btn-group>
        <q-btn
          icon="fa-solid fa-magnifying-glass-plus"
          :label="$t('page.diagrams.actions.zoomPlus')"
          stack
          no-caps
          color="white"
          text-color="black"
          data-cy="zoom-plus-button"
          @click="zoom(true)"
        />
        <q-btn
          icon="fa-solid fa-magnifying-glass-minus"
          :label="$t('page.diagrams.actions.zoomMinus')"
          stack
          no-caps
          color="white"
          text-color="black"
          data-cy="zoom-minus-button"
          @click="zoom(false)"
        />
        <q-btn
          icon="fa-solid fa-plus"
          :label="$t('page.diagrams.actions.create')"
          stack
          no-caps
          color="white"
          text-color="black"
          data-cy="create-model-button"
          @click="DialogEvent.next({
            type: 'open',
            key: 'CreateModel',
          })"
        />
      </q-btn-group>
    </q-page-sticky>
    <delete-model-dialog :project-name="projectName" />
    <create-model-dialog :project-name="projectName" />
  </q-page>
</template>

<script setup>
import { getPluginByName, initComponents } from 'src/composables/PluginManager';
import { getAllModels } from 'src/composables/Project';
import DeleteModelDialog from 'src/components/dialog/DeleteModelDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import PluginEvent from 'src/composables/events/PluginEvent';
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import UpdateModelEvent from 'src/composables/events/ModelEvent';
import CreateModelDialog from 'components/dialog/CreateModelDialog';

const route = useRoute();
const projectName = computed(() => route.params.projectName);
const diagrams = ref([]);
const scale = ref(1);
const translate = reactive({
  x: 0,
  y: 0,
});
const selectedDiagram = ref(null);

let pluginInitSubscription;
let updateModelSubscription;

/**
 * Toggle diagram selection.
 * @param {string} diagram - Selected diagram otherwise null.
 */
function selectDiagram(diagram) {
  if (!diagram?.path || selectedDiagram.value?.path === diagram.path) {
    selectedDiagram.value = null;
  } else {
    selectedDiagram.value = diagram;
  }
}

/**
 * Open DeleteModel dialog and close menu.
 * @param {string} diagram - Diagram to delete.
 */
function deleteDiagram(diagram) {
  DialogEvent.next({
    type: 'open',
    key: 'DeleteModel',
    model: diagram,
  });
}

/**
 * Zoom on diagrams container.
 * @param {boolean} plus - Zoom in on true otherwise zoom out.
 */
function zoom(plus) {
  const div = document.getElementById('diagrams-container');

  if (plus && scale.value < 1) {
    scale.value *= 2;
  } else if (plus && scale.value >= 1) {
    scale.value += 0.5;
  } else if (scale.value >= 1) {
    scale.value -= 0.5;
  } else {
    scale.value /= 2;
  }

  div.style.scale = scale.value;
}

/**
 * Pan on diagrams container according on the delta.
 * @param {object} props - Props containing delta.
 * @param {object} props.delta - Delta of distance (in pixels) since handler was called last time.
 * @see https://quasar.dev/vue-directives/touch-pan#handling-mouse-events
 */
function handlePan({ delta }) {
  const div = document.getElementById('diagrams-container');

  translate.x += delta.x;
  translate.y += delta.y;

  div.style.translate = `${translate.x}px ${translate.y}px`;
}

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
        diagram.path,
      ).then(() => {
        plugin.draw(diagram.id, true);
      });
    }),
  );
}

onMounted(async () => {
  pluginInitSubscription = PluginEvent.InitEvent.subscribe(() => {
    updateDiagrams().then(() => { drawDiagrams(); });
  });
  updateModelSubscription = UpdateModelEvent.subscribe(() => {
    updateDiagrams().then(() => { drawDiagrams(); });
  });

  await updateDiagrams();
  await drawDiagrams();
});

onUnmounted(() => {
  pluginInitSubscription.unsubscribe();
  updateModelSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
#diagrams-page {
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}
.diagram-container {
  border: 2px dashed $primary;
  height: min-content;

  &.selected {
    border-color: $accent;
  }
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
