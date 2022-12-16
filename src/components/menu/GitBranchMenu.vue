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
        data-cy="git-branch-menu-search-bar"
        v-model="searchedBranch"
        dense
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-magnifying-glass" />
        </template>
      </q-input>
      <q-item clickable @click="openGitStatusDialog">
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-question"
            data-cy="git-menu-status"
          />
        </q-item-section>
        <q-item-section>{{ $t('actions.git.status') }}</q-item-section>
      </q-item>
      <q-item clickable @click="openGitCommitDialog">
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-floppy-disk"
            data-cy="git-menu-commit"
          />
        </q-item-section>
        <q-item-section>{{ $t('actions.git.commit') }}</q-item-section>
      </q-item>
      <q-item clickable @click="newBranch">
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-plus"
            data-cy="git-menu-new-branch"
          />
        </q-item-section>
        <q-item-section>{{ $t('actions.git.newBranch') }}</q-item-section>
      </q-item>

      <q-item clickable @click="openLog">
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-list"
            data-cy="git-menu-log"
          />
        </q-item-section>
        <q-item-section>{{ $t('actions.git.log') }}</q-item-section>
      </q-item>

      <template v-if="localBranches.length > 0">
        <git-branch-header-menu :title="$t('menu.git.localBranchesTitle')"/>
        <template v-for="(branch, index) in localBranches">
          <git-branch-item-menu
            :key="`local_${branch.name}`"
            :name="branch.name"
            :full-name="branch.fullName"
            :isCurrentBranch="branch.name === currentBranchName"
            :on-local="branch.onLocal"
            :on-remote="branch.onRemote"
            v-if="showLocal || index < maxItem"
            @action:done="menu.hide()"
            :data-cy="`git-menu-branch-local-${branch.name}`"
          />
        </template>
        <git-branch-expand-list-menu
          data-cy="git-branch-expand-local-menu"
          :open="showLocal"
          :number="localBranches.length - maxItem"
          v-if="localBranches.length > maxItem"
          @click="openCloseExpandMenu(true)"
        />
      </template>

      <template v-if="remoteBranches.length > 0">
        <git-branch-header-menu :title="$t('menu.git.remoteBranchesTitle')"/>
        <template v-for="(branch, index) in remoteBranches">
          <git-branch-item-menu
            :key="`remote_${branch.name}`"
            :name="branch.name"
            :full-name="branch.fullName"
            :isCurrentBranch="branch.name === currentBranchName"
            :on-local="branch.onLocal"
            :on-remote="branch.onRemote"
            v-if="showRemote || index < maxItem"
            @action:done="menu.hide()"
            :data-cy="`git-menu-branch-remote-${branch.name}`"
          />
        </template>
        <git-branch-expand-list-menu
          data-cy="git-branch-expand-remote-menu"
          :open="showRemote"
          :number="remoteBranches.length - maxItem"
          v-if="remoteBranches.length > maxItem"
          @click="openCloseExpandMenu(false)"
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
 * Filter all branches with searched text.
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
async function setBranches() {
  loading.value = true;
  await gitFetch(getProjectById(route.params.projectName));
  allBranches.value = await getBranches(route.params.projectName, true);
  loading.value = false;
}

/**
 * On open menu, focus on the search input and close expand menu.
 */
function onOpen() {
  showLocal.value = false;
  showRemote.value = false;
  setBranches();
}

function onShow() {
  searchInput.value.focus();
}

/**
 * Send event to open the GitNewBranchDialog.
 */
function newBranch() {
  menu.value.hide();
  DialogEvent.next({
    type: 'open',
    key: 'GitNewBranch',
    branch: props.currentBranchName,
  });
}

/**
 * Send event to open the GitStatusDialog.
 */
function openGitStatusDialog() {
  menu.value.hide();
  DialogEvent.next({
    type: 'open',
    key: 'GitStatus',
  });
}
/**
 * Send event to open the GitNewBranchDialog and close the menu.
 */
function openLog() {
  DialogEvent.next({
    type: 'open',
    key: 'GitLog',
    branch: props.currentBranchName,
  });
  menu.value.hide();
}

/**
 * Send event to open the GitCommitDialog.
 */
function openGitCommitDialog() {
  menu.value.hide();
  DialogEvent.next({
    type: 'open',
    key: 'GitCommit',
  });
}
</script>
