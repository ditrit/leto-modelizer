<template>
  <default-dialog
    dialog-key="CreateProjectTemplate"
    data-cy="create-project-template-dialog"
  >
    <template #title>
      {{ $t(`page.home.template.${isChecked ? 'import': 'create'}Project`) }}
    </template>
    <template #default>
      <div v-if="projectTemplate?.schemas.length">
        <q-carousel
          v-model="slide"
          swipeable
          animated
          control-type="flat"
          control-color="primary"
          navigation
          padding
          arrows
          height="200px"
          class="text-primary rounded-borders carousel"
        >
          <q-carousel-slide
            v-for="(schema, index) in projectTemplate.schemas"
            :key="`${schema}-${index}`"
            :name="index+1"
            class="column no-wrap flex-center"
          >
            <div v-viewer>
              <img
                :src="schemas[index]"
                :alt="`${projectTemplate.key}/${projectTemplate.schemas[index]}`"
                class="carousel-img"
              >
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      <create-project-template-form
        class="q-mt-lg"
        :template="projectTemplate"
        :is-checked="isChecked"
        @project:add="addProject"
        @update:checked="e => isChecked = e"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'src/components/dialog/DefaultDialog.vue';
import CreateProjectTemplateForm from 'src/components/form/CreateProjectTemplateForm.vue';
import { useRouter } from 'vue-router';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { getTemplateSchema } from 'src/services/ImageDownloadService';

const router = useRouter();
const projectTemplate = ref(null);
const isChecked = ref(false);
const slide = ref(1);
const schemas = ref([]);
let dialogEventSubscription;

/**
 * Close CreateProjectTemplate and redirect to project model page.
 * @param {string} projectId - Id of the new project.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function addProject(projectId) {
  DialogEvent.next({ type: 'close', key: 'CreateProjectTemplate' });
  await router.push(`/projects/${projectId}/models`);
}

/**
 * Load schema of template.
 * @param {object} template - Template object.
 * @param {number} index - Index of schemas in template.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function loadTemplateSchema(template, index) {
  return getTemplateSchema({
    HAS_BACKEND: process.env.HAS_BACKEND,
    TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
  }, template, index)
    .then((icon) => {
      schemas.value[index] = icon;
    })
    .catch(() => {
      schemas.value[index] = null;
    });
}

/**
 * Set project template on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event key.
 * @param {string} event.type - Event type.
 * @param {object} event.template - Selected template.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function setProjectTemplate({ key, type, template }) {
  if (key === 'CreateProjectTemplate' && type === 'open') {
    projectTemplate.value = template;
    schemas.value = Array(template.schemas.length);
    return Promise.allSettled(template.schemas
      .map((_, index) => loadTemplateSchema(template, index)));
  }
  return Promise.resolve();
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setProjectTemplate);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>

<style scoped lang="scss">
.carousel {
  border: 2px solid #ccc;
  background: rgba(0, 0, 0, 0.05);
}
.carousel-img {
  cursor: zoom-in;
  height: 100px;
}
</style>
