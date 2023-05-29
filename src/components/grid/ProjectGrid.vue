<template>
  <div class="project-grid">
    <div class="row items-center">
      <h4 class="q-ma-md q-mr-xl">
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
      <h5 class="text-primary q-ma-md">
        {{ $t('page.home.project.recent') }}
      </h5>
      <tag-list
        :tags="tags"
        @toggle:tag="onToggleTag"
      />
    </div>
    <div class="row no-wrap q-ml-md">
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
        class="row text-center text-h6 text-grey q-ml-md items-center"
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
import { computed, ref } from 'vue';

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
const filteredProjects = computed(() => tags.value
  .filter(({ active }) => active)
  .reduce((allProjects, { key }) => allProjects.filter(tagFilters[key]), props.projects)
  .slice(0, 12));

/**
 * Toggle tag activation.
 * @param {String} key - Tag key.
 */
function onToggleTag(key) {
  const tag = tags.value.find(({ key: tagKey }) => tagKey === key);

  tag.active = !tag.active;
}
</script>

<style scoped>
.create-project-button {
  width: 150px;
  height: 150px;
}
.project-card-container {
  min-width: 175px;
}
</style>
