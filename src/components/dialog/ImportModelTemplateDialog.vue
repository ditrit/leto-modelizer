<template>
  <default-dialog
    dialog-key="ImportModelTemplate"
    data-cy="import-model-template-dialog"
  >
    <template v-slot:title>
      <q-icon
        color="primary"
        name="fa-solid fa-scroll"
      />
      {{ $t(`actions.models.import.dialog.name`) }}
    </template>
    <template v-slot:default>
      <div class="q-pb-md text-subtitle2">
        {{ $t('page.models.template.selectedTemplate', { template: modelTemplate?.type }) }}
      </div>
      <div class="q-pb-md text-subtitle2 text-italic">
        {{  modelTemplate?.description }}
      </div>
      <div class="q-pb-md text-subtitle2">
        {{ $t('page.models.template.selectedPlugin', { plugin: modelTemplate?.plugin }) }}
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

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const modelTemplate = ref(null);

let dialogEventSubscription;

/**
 * Set model template on valid event.
 * @param {String} key - Event type.
 * @param {Object} template - Selected template.
 */
function setModelTemplate({ key, template }) {
  if (key === 'ImportModelTemplate') {
    modelTemplate.value = template;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setModelTemplate);
});
onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
