<template>
  <q-menu
    class="git-branch-menu"
    data-cy="git-branch-menu"
    ref="menu"
    @before-show="onOpen"
    @show="onShow"
  >
    <q-list style="min-width: 500px">
      <q-input
        ref="searchInput"
        data-cy="search-branch-input"
        v-model="searchedBranch"
        dense
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-magnifying-glass" />
        </template>
      </q-input>
      <q-item
        clickable
        @click="openDialog('GitStatus')"
        data-cy="git-status-item"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-question"
          />
        </q-item-section>
        <q-item-section>
          {{ $t('actions.git.status') }}
        </q-item-section>
      </q-item>
      <q-item
        clickable
        @click="openDialog('GitCommit')"
        data-cy="git-commit-item"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-floppy-disk"
          />
        </q-item-section>
        <q-item-section>
          {{ $t('actions.git.commit') }}
        </q-item-section>
      </q-item>
      <q-item
        clickable
        @click="openDialog('GitNewBranch')"
        data-cy="git-new-branch-item"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-plus"
          />
        </q-item-section>
        <q-item-section>
          {{ $t('actions.git.newBranch') }}
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="openDialog('GitLog')"
        data-cy="git-log-item"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-list"
          />
        </q-item-section>
        <q-item-section>{{ $t('actions.git.log') }}</q-item-section>
      </q-item>

      <template v-if="localBranches.length > 0">
        <git-branch-header-menu :title="$t('menu.git.localBranchesTitle')"/>
        <template v-for="(branch, index) in localBranches">
          <git-branch-item-menu
            v-if="showLocal || index < maxItem"
            :key="`local_${branch.name}`"
            :name="branch.name"
            :full-name="branch.fullName"
            :isCurrentBranch="branch.name === currentBranchName"
            :on-local="branch.onLocal"
            :on-remote="branch.onRemote"
            @action:done="menu.hide()"
            :data-cy="`local-branch_${branch.name}`"
          />
        </template>
        <git-branch-expand-list-menu
          v-if="localBranches.length > maxItem"
          data-cy="expand-local-branch-menu"
          :open="showLocal"
          :number="localBranches.length - maxItem"
          @click="manageExpandMenu(true)"
        />
      </template>

      <template v-if="remoteBranches.length > 0">
        <git-branch-header-menu :title="$t('menu.git.remoteBranchesTitle')"/>
        <template v-for="(branch, index) in remoteBranches">
          <git-branch-item-menu
            v-if="showRemote || index < maxItem"
            :key="`remote_${branch.name}`"
            :name="branch.name"
            :full-name="branch.fullName"
            :isCurrentBranch="branch.name === currentBranchName"
            :on-local="branch.onLocal"
            :on-remote="branch.onRemote"
            @action:done="menu.hide()"
            :data-cy="`remote-branch_${branch.name}`"
          />
        </template>
        <git-branch-expand-list-menu
          v-if="remoteBranches.length > maxItem"
          data-cy="expand-remote-branch-menu"
          :open="showRemote"
          :number="remoteBranches.length - maxItem"
          @click="manageExpandMenu(false)"
        />
      </template>

      <template v-if="loading">
        <span class="q-mr-xs">{{ $t('menu.git.loading')}}</span>
        <q-spinner-dots thickness="2"/>
      </template>

      <template v-if="hasNoBranches && !loading">
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
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import {
  getBranches,
  gitFetch,
  getProjectById,
} from 'src/composables/Project';
import GitBranchExpandListMenu from 'components/menu/GitBranchExpandListMenu';
import DialogEvent from 'src/composables/events/DialogEvent';

const props = defineProps({
  currentBranchName: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const maxItem = ref(5);
const menu = ref(null);
const allBranches = ref([]);
const searchedBranch = ref('');
const showLocal = ref(false);
const showRemote = ref(false);
const searchInput = ref(null);
const hasNoBranches = computed(() => allBranches.value.length === 0);
const loading = ref(false);

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
 * Filter all branches with searched text, then display current branch at the top
 * and sort the remaining branches alphabetically.
 * @param {Array} branches - Array of branches.
 * @param {String} branchType - Branch type.
 * @return {Array} Return array of filtered and sorted branches.
 */
function filterAndSort(branches, branchType) {
  return branches
    .filter((branch) => branch[branchType])
    .filter((branch) => isSearched(branch.name) || isSearched(branch.fullName))
    .sort((a, b) => {
      if (a.name === props.currentBranchName) {
        return -1;
      }
      if (b.name === props.currentBranchName) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
}

const localBranches = computed(() => filterAndSort(allBranches.value, 'onLocal'));
const remoteBranches = computed(() => filterAndSort(allBranches.value, 'onRemote'));

/**
 * Manage opening and closing of expand menu by toggling the state value.
 * @param {Boolean} local - True to manage local branches menu, false for remote branches menu.
 */
function manageExpandMenu(local) {
  if (local) {
    showLocal.value = !showLocal.value;
  } else {
    showRemote.value = !showRemote.value;
  }
}

/**
 * Initialize all branches (locals and remotes) from git.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function setBranches() {
  loading.value = true;
  await gitFetch(getProjectById(route.params.projectName));
  allBranches.value = await getBranches(route.params.projectName, true);
  loading.value = false;
}

/**
 * On open menu, call setBranches and close expand menu for both local and remote.
 */
function onOpen() {
  showLocal.value = false;
  showRemote.value = false;
  setBranches();
}

/**
 * On show menu, focus on the search input.
 */
function onShow() {
  searchInput.value.focus();
}

/**
 * Send event to open the dialog corresponding to the key and close the menu.
 * @param {String} key - Event key.
 */
function openDialog(key) {
  DialogEvent.next({
    type: 'open',
    key,
    branch: props.currentBranchName,
  });
  menu.value.hide();
}
</script>
