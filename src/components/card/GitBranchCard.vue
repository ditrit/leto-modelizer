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
    data-cy="git-current-branch"
  >
    <template v-slot:loading>
      <q-spinner-dots/>
    </template>
  </q-btn>
</template>

<script setup>
import { getCurrentBranch } from 'src/composables/Project';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import GitEvent from 'src/composables/events/GitEvent';

let updateRemoteSubscription;
const route = useRoute();
const loading = ref(true);
const currentBranch = ref('');

function updateBranch() {
  loading.value = true;
  getCurrentBranch(route.params.projectName).then((branch) => {
    currentBranch.value = branch;
  }).finally(() => {
    loading.value = false;
  });
}

onMounted(() => {
  updateBranch();
  updateRemoteSubscription = GitEvent.UpdateRemoteEvent.subscribe(() => {
    updateBranch();
  });
});
onUnmounted(() => {
  updateRemoteSubscription.unsubscribe();
});
</script>
