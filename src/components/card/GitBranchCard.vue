<template>
  <q-btn
    flat
    no-caps
    color="primary"
    class="full-width"
    align="left"
    icon="fa-solid fa-code-branch"
    :loading="loading"
    :label="currentBranch"
    data-cy="git-current-branch-button"
  >
    <template #loading>
      <q-spinner-dots />
    </template>
    <git-branch-menu :current-branch-name="currentBranch" />
  </q-btn>
</template>

<script setup>
// TODO : Rename file
import { getCurrentBranch } from 'src/composables/Git';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import GitEvent from 'src/composables/events/GitEvent';
import FileEvent from 'src/composables/events/FileEvent';
import GitBranchMenu from 'components/menu/GitBranchMenu.vue';

let addRemoteSubscription;
let checkoutSubscription;
let globalUploadFilesEventSubscription;
const route = useRoute();
const loading = ref(true);
const currentBranch = ref('');

/**
 * Update currentBranch and handle loading.
 */
function updateBranch() {
  loading.value = true;
  getCurrentBranch(route.params.projectName).then((branch) => {
    currentBranch.value = branch;
  }).finally(() => {
    loading.value = false;
  });
}

/**
 * Set currentBranch.
 * @param {string} branch - Current branch.
 */
function setCurrentBranch(branch) {
  currentBranch.value = branch;
}

onMounted(() => {
  updateBranch();
  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(updateBranch);
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(setCurrentBranch);
  globalUploadFilesEventSubscription = FileEvent.GlobalUploadFilesEvent.subscribe(updateBranch);
});
onUnmounted(() => {
  addRemoteSubscription.unsubscribe();
  checkoutSubscription.unsubscribe();
  globalUploadFilesEventSubscription.unsubscribe();
});
</script>
