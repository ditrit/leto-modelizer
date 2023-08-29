<template>
  <default-dialog
    dialog-key="GitUpdate"
    data-cy="git-update-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-brands fa-git-alt"
      />
      {{ $t('page.modelizer.git.update.title') }}
    </template>
    <template #default>
      <git-update-form
        :project-name="projectName"
        :branch-name="branchName"
        @git-branch:update="DialogEvent.next({ type: 'close', key: 'GitUpdate' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog.vue';
import GitUpdateForm from 'components/form/GitUpdateForm.vue';
import { onMounted, onUnmounted, ref } from 'vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const branchName = ref(null);
let dialogEventSubscription;

/**
 * Set branch name on valid event.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event type.
 * @param {string} event.branch - Branch name.
 */
function setBranchName({ key, branch }) {
  if (key === 'GitUpdate') {
    branchName.value = branch;
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setBranchName);
});
onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
