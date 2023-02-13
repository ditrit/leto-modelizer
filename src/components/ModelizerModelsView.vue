<template>
  <div>
    <h4>{{ $t('page.models.name') }}</h4>
    <q-btn
      :label="$t('actions.models.create.button.name')"
      :title="$t('actions.models.create.button.title')"
      color="positive"
      class="q-mr-md"
      @click="DialogEvent.next({
        type: 'open',
        key: 'CreateModel',
      })"
    />
    <div class="q-pa-md row items-start q-gutter-md">
      <router-link
        v-for="model in data.models"
        :key="model.id"
        :to="{
          path: `/modelizer/${projectName}/model`,
          query: { path: `${model.plugin}/${model.name}` }}"
      >
        <model-card
          :model="model"
        />
      </router-link>
    </div>
    <TemplateGrid
      class="col-md-8"
      :templates="templates"
      @add:template="openNewModelTemplateDialog"
    >
      <template v-slot:header>
        <h4>{{ $t('page.models.template.create') }}</h4>
      </template>
    </TemplateGrid>
  </div>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
} from 'vue';
import { getAllModels } from 'src/composables/Project';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import ModelCard from 'src/components/card/ModelCard.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import UpdateModelEvent from 'src/composables/events/ModelEvent';
import TemplateGrid from 'src/components/grid/TemplateGrid';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const data = reactive({
  models: [],
});
const templates = ref([]);

let updateModelSubscription;

/**
 * Update models list.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateModels() {
  const path = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${props.projectName}/${process.env.MODELS_DEFAULT_FOLDER}`
    : `${props.projectName}`;

  data.models = await getAllModels(path);
}

/**
 * Open NewProjectTemplate dialog.
 * @param {Object} template - Selected project template.
 */
async function openNewModelTemplateDialog(template) {
  DialogEvent.next({
    type: 'open',
    key: 'ImportModelTemplate',
    template,
  });
}

onMounted(async () => {
  updateModels();
  templates.value = await getTemplatesByType('model');
  updateModelSubscription = UpdateModelEvent.subscribe(updateModels);
});

onUpdated(() => {
  updateModels();
});

onUnmounted(() => {
  updateModelSubscription.unsubscribe();
});
</script>
