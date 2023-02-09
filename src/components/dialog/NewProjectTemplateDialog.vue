<template>
  <default-dialog
    dialog-key="NewProjectTemplate"
    data-cy="new-project-template-dialog"
  >
    <template v-slot:title>
      <q-icon
        color="primary"
        :name="`${isChecked ? 'fa-brands fa-git-alt' : 'fa-solid fa-square-plus'}`"
      />
      {{ $t(`page.home.template.${isChecked ? 'import': 'create'}Project`) }}
    </template>
    <template v-slot:default>
      <div class="q-pb-md text-subtitle2">
        {{ $t('page.home.template.selected', { template: templateName }) }}
      </div>
      <q-checkbox
        v-model="isChecked"
        class="q-mb-md"
        :label="$t('page.home.template.import')"
      />
      <new-project-template-form
        @project:add="addProject"
        :template="projectTemplate"
        :isImportAction="isChecked"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'src/components/dialog/DefaultDialog';
import NewProjectTemplateForm from 'src/components/form/NewProjectTemplateForm';
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
const templateName = computed(() => projectTemplate.value.type);
let dialogEventSubscription;

/**
 * Close NewProjectTemplate and redirect to project model page.
 * @param {String} projectId - Id of the new project.
 */
function addProject(projectId) {
  DialogEvent.next({ type: 'close', key: 'NewProjectTemplate' });
  router.push(`/modelizer/${projectId}/model`);
}

/**
 * Set project template on valid event.
 * @param {String} key - Event type.
 * @param {Object} template - Selected template.
 */
function setProjectTemplate({ key, template }) {
  if (key === 'NewProjectTemplate') {
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
