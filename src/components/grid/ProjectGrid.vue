<template>
  <q-card class="project-grid bg-white q-my-xl">
    <q-card-section class="row items-center justify-start">
      <div class="text-h4 text-primary">
        {{ $t('page.home.project.title') }}
      </div>
    </q-card-section>
    <q-card-section class="row items-center justify-between">
      <div class="row">
        <q-btn
          outline
          no-caps
          color="primary"
          icon="fa-solid fa-plus"
          data-cy="create-project-button"
          :label="$t('actions.home.createProject')"
          :title="$acl.role('create-project')
            ? null
            : $t('errors.permissionsDenied')"
          :disable="!$acl.role('create-project')"
          @click="DialogEvent.next({ type: 'open', key: 'CreateProject' })"
        />
        <q-btn
          outline
          no-caps
          class="q-ml-md"
          color="primary"
          icon="fa-solid fa-cloud-arrow-down"
          data-cy="import-project-button"
          :label="$t('actions.home.importProject')"
          :title="$acl.role('import-project')
            ? null
            : $t('errors.permissionsDenied')"
          :disable="!$acl.role('import-project')"
          @click="DialogEvent.next({ type: 'open', key: 'ImportProject' })"
        />
      </div>
      <div class="row">
        <q-select
          v-model="selectedFilter"
          outlined
          dense
          stack-label
          class="search-bar q-mr-sm"
          :options="filterOptions"
          data-cy="filter-project-select"
          :label="$t('page.home.project.filter.title')"
          @update:model-value="updateProjects"
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ scope.opt.label }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          v-model="selectedSort"
          outlined
          dense
          stack-label
          class="search-bar q-mr-sm"
          :options="sortOptions"
          data-cy="sort-project-select"
          :label="$t('page.home.project.sort.title')"
          @update:model-value="updateProjects"
        >
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ scope.opt.label }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="searchProjectText"
          outlined
          dense
          clearable
          class="search-bar q-mr-md"
          :label="$t('actions.home.searchProject')"
          data-cy="search-project-input"
          @update:model-value="updateProjects"
        >
          <template #prepend>
            <q-icon
              name="fa-solid fa-magnifying-glass"
              size="xs"
            />
          </template>
        </q-input>
      </div>
    </q-card-section>
    <q-card-section class="q-ma-md q-pb-none bg-grey-1 project-card-container">
      <q-table
        flat
        bordered
        grid
        :rows="filteredProjects"
      >
        <template #item="data">
          <project-card
            :project="data.row"
            class="q-ma-md"
            @reload-projects="updateProjects()"
          />
        </template>
        <template #no-data>
          <div
            class="row text-center text-subtitle1 q-ml-md text-grey items-center"
            data-cy="project-grid-empty"
          >
            {{ $t('page.home.project.empty') }}
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import ProjectCard from 'src/components/card/ProjectCard.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { searchText } from 'src/composables/Filter';
import { useI18n } from 'vue-i18n';
import { getProjects } from 'src/composables/Project';
import ProjectEvent from 'src/composables/events/ProjectEvent';

const { t } = useI18n();
const filteredProjects = ref([]);
const selectedSort = ref(null);
const selectedFilter = ref(null);
const sortOptions = computed(() => [{
  label: t('page.home.project.sort.dateAsc'),
  value: 'date-asc',
  icon: 'fa-solid fa-arrow-down-1-9',
}, {
  label: t('page.home.project.sort.dateDesc'),
  value: 'date-desc',
  icon: 'fa-solid fa-arrow-up-1-9',
}, {
  label: t('page.home.project.sort.nameAsc'),
  value: 'name-asc',
  icon: 'fa-solid fa-arrow-down-a-z',
}, {
  label: t('page.home.project.sort.nameDesc'),
  value: 'name-desc',
  icon: 'fa-solid fa-arrow-up-a-z',
}]);
const filterOptions = computed(() => [{
  label: t('page.home.project.filter.all'),
  value: 'all',
  icon: 'fa-solid fa-star-of-life',
}, {
  label: t('page.home.project.filter.local'),
  value: 'local',
  icon: 'fa-solid fa-house-chimney',
}, {
  label: t('page.home.project.filter.remote'),
  value: 'remote',
  icon: 'fa-solid fa-cloud',
}, {
  label: t('page.home.project.filter.favorite'),
  value: 'favorite',
  icon: 'fa-solid fa-heart',
}]);
const searchProjectText = ref('');

let updateProjectSubscription;

/**
 * Update projects list according to filter, sort and input search.
 */
function updateProjects() {
  const projects = getProjects();
  const sortType = selectedSort.value.value;
  const filterType = selectedFilter.value.value;

  filteredProjects.value = Object.keys(projects)
    .map((key) => projects[key])
    .filter(({ id }) => searchText(id, searchProjectText.value))
    .filter(({ isFavorite, git }) => {
      if (filterType === 'all') {
        return true;
      }

      if (filterType === 'favorite') {
        return isFavorite;
      }

      if (filterType === 'local') {
        return git.repository === null;
      }

      return git.repository !== null;
    })
    .sort((a, b) => {
      if (sortType === 'name-asc') {
        return a.id.localeCompare(b.id);
      }

      if (sortType === 'name-desc') {
        return b.id.localeCompare(a.id);
      }

      if (sortType === 'date-asc') {
        return a.creationDate - b.creationDate;
      }

      return b.creationDate - a.creationDate;
    });
}

onMounted(() => {
  [, selectedSort.value] = sortOptions.value;
  [selectedFilter.value] = filterOptions.value;
  updateProjects();
  updateProjectSubscription = ProjectEvent.UpdateProjectEvent.subscribe(updateProjects);
});

onUnmounted(() => {
  updateProjectSubscription.unsubscribe();
});
</script>

<style scoped>
.project-card-container {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
.search-bar {
  min-width: 300px;
}
</style>
