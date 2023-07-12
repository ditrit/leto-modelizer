<template>
  <default-dialog
    dialog-key="ImportModelTemplate"
    data-cy="import-model-template-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-scroll"
      />
      {{ $t(`actions.models.import.dialog.name`) }}
    </template>
    <template
      v-if="modelTemplate"
      #default
    >
      <div class="q-pb-md text-center text-subtitle2">
        {{ modelTemplate.type }}
      </div>
      <div
        v-viewer
        class="row justify-center q-mb-sm"
      >
        <img
          :src="`template-library/templates/${modelTemplate.key}/schema.svg`"
          :alt="`${modelTemplate.key}/schema.svg`"
          class="carousel-img"
        >
      </div>
      <div class="q-pb-md text-center text-subtitle2 text-italic">
        {{ modelTemplate.description }}
      </div>
      <div class="q-pb-md text-subtitle2">
        {{ $t('page.models.template.selectedPlugin', { plugin: modelTemplate.plugin }) }}
      </div>
      <import-model-template-form
        :project-name="projectName"
        :template="modelTemplate"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog';
import DialogEvent from 'src/composables/events/DialogEvent';
import ImportModelTemplateForm from 'components/form/ImportModelTemplateForm.vue';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { getPluginByName } from 'src/composables/PluginManager';
import { getProjectFiles } from 'src/composables/Project';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const modelTemplate = ref(null);
const allProjectFiles = ref([]);
const allProjectDiagrams = ref([]);

let dialogEventSubscription;

/**
 * Initialize all project files, plugin and diagrams.
 */
async function init() {
  allProjectFiles.value = await getProjectFiles(props.projectName);
  const plugin = getPluginByName(modelTemplate.value.plugin);
  allProjectDiagrams.value = plugin.getModels(allProjectFiles.value);
}

/**
 * Set model template on valid event.
 * @param {String} key - Event type.
 * @param {Object} template - Selected template.
 */
function setModelTemplate({ key, template }) {
  if (key === 'ImportModelTemplate') {
    modelTemplate.value = template;
    init();
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setModelTemplate);
});
onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
<style scoped lang="scss">
.carousel-img {
  cursor: zoom-in;
  height: 100px;
}
</style>
<style>
.viewer-move {
  background-color: white;
}
</style>
