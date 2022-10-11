<template>
  <q-menu data-cy="git-branch-menu">
    <q-list style="min-width: 500px">
      <git-branch-header-menu :title="$t('menu.git.localBranchesTitle')"/>
      <template v-for="(branch, index) in branches.local">
        <git-branch-item-menu
          :key="`local_${branch.name}`"
          :name="branch.name"
          :full-name="branch.fullName"
          :current="branch.name === currentBranchName"
          v-if="showLocal || index < maxItem"
          :data-cy="`git-menu-branch-local-${branch.name}`"
        />
      </template>
      <git-branch-expand-list-menu
        :open="showLocal"
        :number="branches.local.length - maxItem"
        v-if="branches.local.length > maxItem"
        @click="openCloseExpandMenu(true)"
      />

      <q-separator/>

      <git-branch-header-menu :title="$t('menu.git.remoteBranchesTitle')"/>
      <template v-for="(branch, index) in branches.remote">
        <git-branch-item-menu
          :key="`remote_${branch.name}`"
          :name="branch.name"
          :full-name="branch.fullName"
          :current="branch.name === currentBranchName"
          v-if="showRemote || index < maxItem"
          :data-cy="`git-menu-branch-remote-${branch.name}`"
        />
      </template>
      <git-branch-expand-list-menu
        :open="showRemote"
        :number="branches.remote.length - maxItem"
        v-if="branches.remote.length > maxItem"
        @click="openCloseExpandMenu(false)"
      />
    </q-list>
  </q-menu>
</template>

<script setup>
import GitBranchItemMenu from 'components/menu/GitBranchItemMenu';
import GitBranchHeaderMenu from 'components/menu/GitBranchHeaderMenu';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getBranches, fetchGit, getProjectById } from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';
import GitBranchExpandListMenu from 'components/menu/GitBranchExpandListMenu';

defineProps({
  currentBranchName: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const maxItem = ref(5);
const branches = ref({
  local: [],
  remote: [],
});
const showLocal = ref(false);
const showRemote = ref(false);
let fetchSubscription;

/**
 * Change state value of expand menu.
 * @param {Boolean} local - Choose menu you want to modify.
 */
function openCloseExpandMenu(local) {
  if (local) {
    showLocal.value = !showLocal.value;
  } else {
    showRemote.value = !showRemote.value;
  }
}
/**
 * Initialize all branches (local and remote) from git.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function initBranches() {
  const allBranches = await getBranches(route.params.projectName, true);
  allBranches.forEach((branch) => {
    if (branch.onLocal) {
      branches.value.local.push(branch);
    }
    if (branch.onRemote) {
      branches.value.remote.push(branch);
    }
  });
}

onMounted(() => {
  fetchSubscription = GitEvent.FetchEvent.subscribe(initBranches);
  fetchGit(getProjectById(route.params.projectName));
});
onUnmounted(() => {
  fetchSubscription.unsubscribe();
});
</script>
