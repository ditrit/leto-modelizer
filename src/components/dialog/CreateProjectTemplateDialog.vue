<template>
  <default-dialog
    dialog-key="CreateProjectTemplate"
    data-cy="create-project-template-dialog"
  >
    <template #title>
      {{
        $t(
          `page.home.template.${isChecked ? 'import': 'create'}Project`,
          { name: templateName },
        )
      }}
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
            v-for="(schema, index) in projectTemplate?.schemas"
            :key="index"
            :name="index+1"
            class="column no-wrap flex-center"
          >
            <div v-viewer>
              <img
                :src="`template-library/templates/${projectTemplate.key}/${schema}`"
                :alt="`${projectTemplate.key}/${schema}`"
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
  computed,
} from 'vue';

const router = useRouter();
const projectTemplate = ref(null);
const isChecked = ref(false);
const slide = ref(1);
const templateName = computed(() => projectTemplate.value.type);
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
 * Set project template on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event type.
 * @param {object} event.template - Selected template.
 */
function setProjectTemplate({ key, template }) {
  if (key === 'CreateProjectTemplate') {
    projectTemplate.value = template;
  }
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
