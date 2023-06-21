<template>
  <div class="fit row justify-center">
    <div class="col-md-8">
      <div class="row items-center">
        <h4>
          {{ $t('page.models.name') }}
        </h4>
        <q-btn
          outline
          no-caps
          class="q-ml-xl"
          color="primary"
          icon="fa-solid fa-layer-group"
          :label="$t('actions.models.add.button.name')"
          :title="$t('actions.models.add.button.title')"
          data-cy="add-model-button"
          @click="DrawerEvent.next({
            key: 'CreateDiagram',
            type: 'open',
          })"
        />
        <q-btn
          outline
          no-caps
          class="q-ml-xl"
          color="primary"
          icon="fa-solid fa-plus"
          :label="$t('actions.models.create.button.name')"
          :title="$t('actions.models.create.button.title')"
          data-cy="create-model-button"
          @click="DialogEvent.next({
            type: 'open',
            key: 'CreateModel',
          })"
        />
      </div>
      <div class="row justify-end q-mb-md">
        <div class="row items-center">
          <q-btn
            outline
            color="primary"
            dense
            :disable="isDiagramGrid"
            class="q-mr-md"
            icon="fa-solid fa-grip"
            data-cy="diagram-grid-button"
            @click="switchDiagramType"
          />
          <q-btn
            outline
            color="primary"
            :disable="!isDiagramGrid"
            dense
            icon="fa-solid fa-bars"
            data-cy="diagram-table-button"
            @click="switchDiagramType"
          />
        </div>
      </div>
      <diagram-filter-card
        v-model:selected-tags="selectedTags"
        v-model:search-text="searchDiagramText"
        :tags="allTags"
        @update:search-text="updateModels"
        @update:selected-tags="updateModels"
      />
      <diagram-grid
        v-if="isDiagramGrid"
        :diagrams="data.models"
        @click:diagram="onDiagramClick"
      />
      <diagram-table
        v-else
        :diagrams="data.models"
        class="q-mt-md"
        @click:diagram="onDiagramClick"
      />
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  reactive,
  watch,
  computed, ref,
} from 'vue';
import { getAllModels } from 'src/composables/Project';
import DiagramTable from 'src/components/table/DiagramTable';
import DiagramGrid from 'src/components/grid/DiagramGrid';
import DialogEvent from 'src/composables/events/DialogEvent';
import UpdateModelEvent from 'src/composables/events/ModelEvent';
import { useRoute, useRouter } from 'vue-router';
import { getAllTags } from 'src/composables/PluginManager';
import { searchText } from 'src/composables/Filter';
import DiagramFilterCard from 'components/card/DiagramFilterCard.vue';
import DrawerEvent from 'src/composables/events/DrawerEvent';

const DIAGRAM_STORAGE_KEY = 'diagramType';
const route = useRoute();
const router = useRouter();
const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const data = reactive({
  models: [],
});
const searchDiagramText = ref('');
const selectedTags = ref([]);
const allTags = ref(getAllTags());
const isDiagramGrid = ref(localStorage.getItem(DIAGRAM_STORAGE_KEY) === 'grid');
const viewType = computed(() => route.params.viewType);

let updateModelSubscription;

/**
 * Update diagram type and local storage values.
 * @param {String} type - Diagram type.
 */
function switchDiagramType() {
  isDiagramGrid.value = !isDiagramGrid.value;
  localStorage.setItem(DIAGRAM_STORAGE_KEY, isDiagramGrid.value ? 'grid' : 'table');
}

/**
 * Redirect to ModelizerDrawView corresponding to the given diagram.
 * @param {Object} diagram - Diagram to open.
 */
async function onDiagramClick(diagram) {
  await router.push({
    name: 'modelizer',
    params: {
      viewType: 'draw',
      projectName: props.projectName,
    },
    query: {
      path: `${diagram.plugin}/${diagram.name}`,
    },
  });
}

/**
 * Update models list.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateModels() {
  data.models = (await getAllModels(props.projectName))
    .filter(({ name }) => searchText(name, searchDiagramText.value))
    .filter(({ tags }) => {
      if (selectedTags.value.length === 0) {
        return true;
      }
      return tags.some((tag) => selectedTags.value.includes(tag));
    });
}

watch(() => viewType.value, async () => {
  if (viewType.value === 'models') {
    await updateModels();
  }
});

onMounted(async () => {
  await updateModels();
  updateModelSubscription = UpdateModelEvent.subscribe(updateModels);
});

onUnmounted(() => {
  updateModelSubscription.unsubscribe();
});
</script>
