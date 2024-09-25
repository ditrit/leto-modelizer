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
          v-if="schema"
          :src="schema"
          alt="schema.svg"
          class="carousel-img"
        >
      </div>
      <div class="q-pb-md text-center text-subtitle2 text-italic">
        {{ modelTemplate.description }}
      </div>
      <div class="q-pb-md text-subtitle2">
        {{ $t('page.models.template.selectedPlugin', { plugin: modelTemplate.plugins[0] }) }}
      </div>
      <import-model-template-form
        :project-name="projectName"
        :template="modelTemplate"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import ImportModelTemplateForm from 'components/form/ImportModelTemplateForm.vue';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { getPluginByName } from 'src/composables/PluginManager';
import { getProjectFiles } from 'src/composables/Project';
import { getTemplateSchema } from 'src/services/ImageDownloadService';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const modelTemplate = ref(null);
const allProjectFiles = ref([]);
const allProjectDiagrams = ref([]);
const schema = ref(null);

let dialogEventSubscription;

/**
 * Load schema of template.
 * @param {object} template - Template object.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function loadTemplateSchema(template) {
  return getTemplateSchema({
    HAS_BACKEND: process.env.HAS_BACKEND,
    TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
  }, template, 0)
    .then((image) => {
      schema.value = image;
    })
    .catch(() => {
      schema.value = null;
    });
}

/**
 * Initialize all project files, plugin and diagrams.
 */
async function init() {
  const plugin = getPluginByName(modelTemplate.value.plugins[0]);

  allProjectFiles.value = await getProjectFiles(props.projectName);
  allProjectDiagrams.value = plugin.getModels(allProjectFiles.value);

  await loadTemplateSchema(modelTemplate.value);
}

/**
 * Set model template on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event type.
 * @param {object} event.template - Selected template.
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
