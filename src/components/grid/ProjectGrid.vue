<template>
  <div class="project-grid">
    <div class="row items-center">
      <h4 class="q-mr-xl q-my-md">
        {{ $t('page.home.project.title') }}
      </h4>
      <q-btn
        outline
        no-caps
        class="q-ml-sm"
        color="primary"
        icon="fa-solid fa-cloud-arrow-down"
        :label="$t('actions.home.importProject')"
        data-cy="import-project-button"
        @click="DialogEvent.next({ type: 'open', key: 'ImportProject' })"
      />
    </div>
    <div class="row items-center">
      <h5 class="text-primary q-mr-md">
        {{ $t('page.home.project.recent') }}
      </h5>
      <tag-list
        :tags="tags"
        @toggle:tag="onToggleTag"
      />
      <q-input
        v-model="searchProjectText"
        outlined
        dense
        clearable
        class="search-bar q-mr-md"
        :label="$t('actions.default.search')"
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
    <div class="row no-wrap">
      <div class="row">
        <q-btn
          outline
          no-caps
          color="primary"
          class="create-project-button"
          data-cy="create-project-button"
          @click="DialogEvent.next({ type: 'open', key: 'CreateProject' })"
        >
          <template #default>
            <div class="column items-center">
              <q-icon
                name="fa-solid fa-plus"
                color="primary"
                size="4rem"
              />
              <label>
                {{ $t('page.home.project.create') }}
              </label>
            </div>
          </template>
        </q-btn>
      </div>
      <div class="row items-center">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card-container row q-mb-lg justify-center items-center col-2"
        >
          <project-card
            :project="project"
          />
        </div>
      </div>
      <div
        v-if="filteredProjects.length === 0"
        class="row text-center text-subtitle1 q-ml-md text-grey items-center"
        data-cy="project-grid-empty"
      >
        {{ $t('page.home.project.empty') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import ProjectCard from 'src/components/card/ProjectCard.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import TagList from 'components/list/TagList.vue';
import { onMounted, ref, watch } from 'vue';
import { searchText } from 'src/composables/Filter';

const props = defineProps({
  projects: {
    type: Array,
    required: true,
  },
});

const tags = ref([{
  key: 'local',
  active: false,
}, {
  key: 'remote',
  active: false,
}]);
const tagFilters = {
  local: (project) => project.isLocal,
  remote: (project) => project.isRemote,
};
const filteredProjects = ref([]);
const searchProjectText = ref('');

/**
 * Update projects list according to tags and input search.
 */
function updateProjects() {
  filteredProjects.value = props.projects
    .filter(({ id }) => searchText(id, searchProjectText.value))
    .filter((project) => tags.value
      .filter(({ active }) => active)
      .every(({ key }) => tagFilters[key](project)))
    .slice(0, 12);
}

/**
 * Toggle tag activation.
 * @param {string} key - Tag key.
 */
function onToggleTag(key) {
  const tag = tags.value.find(({ key: tagKey }) => tagKey === key);

  tag.active = !tag.active;
  updateProjects();
}

watch(() => props.projects, () => {
  updateProjects();
});

onMounted(() => {
  updateProjects();
});
</script>

<style scoped>
.create-project-button {
  width: 150px;
  height: 150px;
}
.project-card-container {
  min-width: 175px;
}
.search-bar {
  margin-left: auto;
  min-width: 300px;
}
</style>
