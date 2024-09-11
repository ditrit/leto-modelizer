<template>
  <default-dialog
    dialog-key="DeleteAIConversation"
    data-cy="delete-ai-conversation-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-comments"
      />
      {{ $t(`page.modelizer.drawer.aichat.dialog.title`) }}
    </template>
    <template #default>
      <div
        class="q-pb-lg"
        v-html="$t('page.modelizer.drawer.aichat.dialog.description')"
      />
      <div class="flex row items-center justify-center">
        <q-btn
          icon="fa-solid fa-trash"
          :label="$t('actions.default.delete')"
          type="submit"
          :loading="submitting"
          color="negative"
          data-cy="submit-button"
          @click="submit"
        >
          <template #loading>
            <q-spinner-dots />
          </template>
        </q-btn>
      </div>
    </template>
  </default-dialog>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import { deleteConversation } from 'src/services/AIService';

const projectName = ref(null);
const diagramPath = ref(null);
const pluginName = ref(null);
const submitting = ref(false);
let dialogEventSubscription;

/**
 * Set AI conversation id on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event key.
 * @param {string} event.projectName - Project name.
 * @param {string} event.diagramPath - Diagram path.
 * @param {string} event.pluginName - Plugin name.
 */
function setAIConversationId(event) {
  if (event.key === 'DeleteAIConversation') {
    projectName.value = event.projectName;
    diagramPath.value = event.diagramPath;
    pluginName.value = event.pluginName;
  }
}

/**
 * Delete AI conversation and close dialog.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
function submit() {
  submitting.value = true;

  return deleteConversation(
    projectName.value,
    diagramPath.value,
    pluginName.value,
  ).finally(() => {
    submitting.value = false;
    DialogEvent.next({
      key: 'DeleteAIConversation',
      type: 'close',
    });
  });
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setAIConversationId);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
