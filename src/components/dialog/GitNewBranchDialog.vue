<template>
  <default-dialog
    dialog-key="GitNewBranch"
    data-cy="git-new-branch-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-brands fa-git-alt"
      />
      {{ $t('page.modelizer.git.newBranch.title') }}
    </template>
    <template #default>
      <git-new-branch-form
        :project-name="projectName"
        :branch-name="branchName"
        @git-branch:create="DialogEvent.next({ type: 'close', key: 'GitNewBranch' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog';
import GitNewBranchForm from 'components/form/GitNewBranchForm';
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
 * @param {String} key - Event type.
 * @param {String} branch - Branch name.
 */
function setBranchName({ key, branch }) {
  if (key === 'GitNewBranch') {
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
