<template>
  <q-card
    class="bg-white q-pa-lg"
  >
    <q-card-section class="row items-center justify-between">
      <div class="text-h6 text-secondary">
        {{ $t('page.models.name') }}
      </div>
      <div>
        <q-btn
          outline
          no-caps
          :label="$t('actions.models.create.button.label')"
          color="primary"
          icon="fa-solid fa-layer-group"
          data-cy="create-diagram-button"
        >
          <q-menu auto-close>
            <q-list
              style="min-width: 100px"
            >
              <q-item
                clickable
                :label="$t('actions.models.create.button.scratch.label')"
                :title="$acl.role('create-diagram')
                  ? $t('actions.models.create.button.scratch.title')
                  : $t('errors.permissionsDenied')"
                data-cy="create-diagram-from-scratch-button"
                :disable="!$acl.role('create-diagram')"
                @click="DialogEvent.next({
                  type: 'open',
                  key: 'CreateModel',
                })"
              >
                {{ $t('actions.models.create.button.scratch.name') }}
              </q-item>
              <q-separator />
              <template v-if="HAS_BACKEND">
                <q-separator />
                <q-item
                  clickable
                  :label="$t('actions.models.create.button.ai.label')"
                  :title="$t('actions.models.create.button.ai.title')"
                  data-cy="create-diagram-from-ia-button"
                  @click="DialogEvent.next({
                    type: 'open',
                    key: 'CreateAIModel',
                  })"
                >
                  {{ $t('actions.models.create.button.ai.name') }}
                </q-item>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
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

import DiagramTable from 'src/components/table/DiagramTable.vue';
import DiagramGrid from 'src/components/grid/DiagramGrid.vue';
import DiagramFilterCard from 'components/card/DiagramFilterCard.vue';

import DialogEvent from 'src/composables/events/DialogEvent';
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
const HAS_BACKEND = computed(() => process.env.HAS_BACKEND);

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
