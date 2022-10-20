<template>
  <default-dialog dialog-key="GitPush" data-cy="git-push-dialog">
    <template v-slot:title>
      <q-icon color="primary" name="fa-brands fa-git-alt" />
      {{ $t('page.modelizer.git.push.title') }}
    </template>
    <template v-slot:default>
      <git-push-form
        :project-name="projectName"
        :branch-name="branchName"
        @git-branch:push="DialogEvent.next({ type: 'close', key: 'GitPush' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog';
import GitPushForm from 'components/form/GitPushForm';
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
  if (key === 'GitPush') {
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
