<template>
  <q-menu
    ref="menu"
    class="git-branch-menu"
    data-cy="git-branch-menu"
    @before-show="onOpen"
    @show="onShow"
  >
    <q-list style="min-width: 500px">
      <q-input
        ref="searchInput"
        v-model="searchedBranch"
        dense
        clearable
        data-cy="search-branch-input"
      >
        <template #prepend>
          <q-icon name="fa-solid fa-magnifying-glass" />
        </template>
      </q-input>
      <q-item
        clickable
        data-cy="git-status-item"
        @click="openDialog('GitStatus')"
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
        data-cy="git-commit-item"
        @click="openDialog('GitCommit')"
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
        data-cy="git-new-branch-item"
        @click="openDialog('GitNewBranch')"
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
        data-cy="git-log-item"
        @click="openDialog('GitLog')"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-list"
          />
        </q-item-section>
        <q-item-section>
          {{ $t('actions.git.log') }}
        </q-item-section>
      </q-item>

      <template v-if="localBranches.length > 0">
        <git-branch-header-menu :title="$t('menu.git.localBranchesTitle')" />
        <template v-for="(branch, index) in localBranches">
          <git-branch-item-menu
            v-if="showLocal || index < maxItem"
            :key="`local_${branch.name}`"
            :name="branch.name"
            :full-name="branch.fullName"
            :is-current-branch="branch.name === currentBranchName"
            :on-local="branch.onLocal"
            :on-remote="branch.onRemote"
            :data-cy="`local-branch_${branch.name}`"
            @action:done="menu.hide()"
          />
        </template>
        <git-branch-expand-list-menu
          v-if="localBranches.length > maxItem"
          :open="showLocal"
          :number="localBranches.length - maxItem"
          data-cy="expand-local-branch-menu"
          @click="manageExpandMenu(true)"
        />
      </template>

      <template v-if="remoteBranches.length > 0">
        <git-branch-header-menu :title="$t('menu.git.remoteBranchesTitle')" />
        <template v-for="(branch, index) in remoteBranches">
          <git-branch-item-menu
            v-if="showRemote || index < maxItem"
            :key="`remote_${branch.name}`"
            :name="branch.name"
            :full-name="branch.fullName"
            :is-current-branch="branch.name === currentBranchName"
            :on-local="branch.onLocal"
            :on-remote="branch.onRemote"
            :data-cy="`remote-branch_${branch.name}`"
            @action:done="menu.hide()"
          />
        </template>
        <git-branch-expand-list-menu
          v-if="remoteBranches.length > maxItem"
          :open="showRemote"
          :number="remoteBranches.length - maxItem"
          data-cy="expand-remote-branch-menu"
          @click="manageExpandMenu(false)"
        />
      </template>

      <template v-if="loading">
        <span class="q-mr-xs">{{ $t('menu.git.loading') }}</span>
        <q-spinner-dots thickness="2" />
      </template>

      <template v-if="hasNoBranches && !loading">
        <q-item>
          <q-item-section>
            {{ $t('menu.git.noBranches') }}
          </q-item-section>
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
import { searchText } from 'src/composables/Filter';

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
 * Filter all branches with searched text, then display current branch at the top
 * and sort the remaining branches alphabetically.
 * @param {Array} branches - Array of branches.
 * @param {string} branchType - Branch type.
 * @returns {Array} Return array of filtered and sorted branches.
 */
function filterAndSort(branches, branchType) {
  return branches
    .filter((branch) => branch[branchType])
    .filter((branch) => searchText(branch.name, searchedBranch.value)
        || searchText(branch.fullName, searchedBranch.value))
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
 * @param {boolean} local - True to manage local branches menu, false for remote branches menu.
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
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
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
async function onOpen() {
  showLocal.value = false;
  showRemote.value = false;
  await setBranches();
}

/**
 * On show menu, focus on the search input.
 */
function onShow() {
  searchInput.value.focus();
}

/**
 * Send event to open the dialog corresponding to the key and close the menu.
 * @param {string} key - Event key.
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
