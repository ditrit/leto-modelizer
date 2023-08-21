<template>
  <q-card
    flat
    class="bg-white q-pa-lg"
  >
    <q-card-section class="row items-center justify-between">
      <div class="text-h6">
        {{ $t('page.models.name') }}
      </div>
      <div>
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
    </q-card-section>
    <q-card-section class="row justify-end">
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
    </q-card-section>
    <q-card-section class="q-pt-none">
      <diagram-filter-card
        v-model:selected-tags="selectedTags"
        v-model:search-text="searchDiagramText"
        :tags="categoryTags"
        @update:search-text="updateModels"
        @update:selected-tags="updateModels"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <diagram-grid
        v-if="isDiagramGrid"
        :diagrams="data.models"
        @click:diagram="onDiagramClick"
      />
      <diagram-table
        v-else
        :diagrams="data.models"
        class=""
        @click:diagram="onDiagramClick"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  reactive,
  watch,
  computed,
  ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAllModels } from 'src/composables/Project';
import { getAllTagsByType } from 'src/composables/PluginManager';
import { searchText } from 'src/composables/Filter';

import DiagramTable from 'src/components/table/DiagramTable';
import DiagramGrid from 'src/components/grid/DiagramGrid';
import DiagramFilterCard from 'components/card/DiagramFilterCard.vue';

import DialogEvent from 'src/composables/events/DialogEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';
import UpdateModelEvent from 'src/composables/events/ModelEvent';
import { getUserSetting, setUserSetting } from 'src/composables/Settings';

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
const categoryTags = ref(getAllTagsByType('category'));
const isDiagramGrid = ref(getUserSetting('displayType') === 'grid');
const viewType = computed(() => route.params.viewType);

let updateModelSubscription;

/**
 * Update diagram type and local storage values.
 */
function switchDiagramType() {
  isDiagramGrid.value = !isDiagramGrid.value;
  setUserSetting('displayType', isDiagramGrid.value ? 'grid' : 'table');
}

/**
 * Redirect to ModelizerDrawView corresponding to the given diagram.
 * @param {object} diagram - Diagram to open.
 */
async function onDiagramClick(diagram) {
  await router.push({
    name: 'Draw',
    params: {
      projectName: props.projectName,
    },
    query: {
      plugin: diagram.plugin,
      path: diagram.path,
    },
  });
}

/**
 * Update diagrams list.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateModels() {
  data.models = (await getAllModels(props.projectName))
    .filter(({ path }) => searchText(path, searchDiagramText.value))
    .filter(({ tags }) => selectedTags.value.length === 0
      || tags.some(({ value }) => selectedTags.value.includes(value)));
}

watch(() => viewType.value, async () => {
  if (viewType.value === 'models') {
    await updateModels();
  }
});

onMounted(async () => {
  await updateModels();

  updateModelSubscription = UpdateModelEvent.subscribe(() => {
    updateModels();
  });
});

onUnmounted(() => {
  updateModelSubscription.unsubscribe();
});
</script>
