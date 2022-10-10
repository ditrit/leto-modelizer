<template>
  <q-menu
    class="git-branch-menu"
    data-cy="git-branch-menu"
    @show="onOpenMenu"
  >
    <q-list style="min-width: 500px">
      <q-input
        ref="searchInput"
        data-cy="git-branch-menu-search-bar"
        v-model="searchedBranch"
        dense
        clearable
        @update:model-value="filter"
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-magnifying-glass" />
        </template>
      </q-input>

      <template v-if="filteredBranches.local.length > 0">
        <git-branch-header-menu :title="$t('menu.git.localBranchesTitle')"/>
        <template v-for="(branch, index) in filteredBranches.local">
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
          data-cy="git-branch-expand-local-menu"
          :open="showLocal"
          :number="filteredBranches.local.length - maxItem"
          v-if="filteredBranches.local.length > maxItem"
          @click="openCloseExpandMenu(true)"
        />
      </template>

      <template v-if="filteredBranches.remote.length > 0">
        <git-branch-header-menu :title="$t('menu.git.remoteBranchesTitle')"/>
        <template v-for="(branch, index) in filteredBranches.remote">
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
          data-cy="git-branch-expand-remote-menu"
          :open="showRemote"
          :number="filteredBranches.remote.length - maxItem"
          v-if="filteredBranches.remote.length > maxItem"
          @click="openCloseExpandMenu(false)"
        />
      </template>

      <template v-if="hasNoBranches">
        <q-item>
          <q-item-section>{{ $t('menu.git.noBranches')}}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-menu>
</template>

<script setup>
import GitBranchItemMenu from 'components/menu/GitBranchItemMenu';
import GitBranchHeaderMenu from 'components/menu/GitBranchHeaderMenu';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { getBranches, fetchGit, getProjectById } from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';
import GitBranchExpandListMenu from 'components/menu/GitBranchExpandListMenu';

const props = defineProps({
  currentBranchName: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const maxItem = ref(5);
const filteredBranches = ref({
  local: [],
  remote: [],
});
const branches = ref({
  local: [],
  remote: [],
});
const searchedBranch = ref('');
const showLocal = ref(false);
const showRemote = ref(false);
const searchInput = ref(null);
const hasNoBranches = computed(() => filteredBranches.value.local.length === 0
    && filteredBranches.value.remote.length === 0);
let fetchSubscription;

/**
 * On open menu, focus on the search input and close expand menu.
 */
function onOpenMenu() {
  searchInput.value.focus();
  showLocal.value = false;
  showRemote.value = false;
}

/**
 * Indicate if branch name contains searched text.
 * @param {String} branch - Branch name.
 * @return {Boolean} Return true if branch contains searched text otherwise return false.
 */
function isSearched(branch) {
  if (!searchedBranch.value || searchedBranch.value.trim().length === 0) {
    return true;
  }

  return searchedBranch.value.toLowerCase().split(' ')
    .filter((searchedText) => searchedText !== '')
    .some((searchedText) => branch.toLowerCase().includes(searchedText));
}

/**
 * Filter all branches with searched text.
 */
function filter() {
  filteredBranches.value.local = branches.value.local
    .filter((branch) => isSearched(branch.name) || isSearched(branch.fullName))
    .sort((a, b) => a.compare(b));

  filteredBranches.value.remote = branches.value.remote
    .filter((branch) => isSearched(branch.name) || isSearched(branch.fullName))
    .sort((a, b) => a.compare(b));
}

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
  const local = [];
  const remote = [];
  allBranches.forEach((branch) => {
    branch.current = props.currentBranchName === branch.name;
    if (branch.onLocal) {
      local.push(branch);
    }
    if (branch.onRemote) {
      remote.push(branch);
    }
  });
  branches.value.local = local;
  branches.value.remote = remote;
  filter();
}

onMounted(() => {
  fetchSubscription = GitEvent.FetchEvent.subscribe(initBranches);
  fetchGit(getProjectById(route.params.projectName));
});
onUnmounted(() => {
  fetchSubscription.unsubscribe();
});
</script>
