<template>
  <q-expansion-item
    :label="$t('page.home.drawer.projects.title')"
    expand-icon="fa-solid fa-plus"
    expanded-icon="fa-solid fa-minus"
    expand-icon-class="text-primary"
    header-class="text-uppercase text-primary text-weight-bold"
    class="short-project-item"
    data-cy="project-expansion-item"
  >
    <q-list>
      <q-item
        v-for="project in projects"
        :key="project.id"
        :to="`/${project.id}/models`"
        :data-cy="`item_${project.id}`"
      >
        <q-item-section>
          <q-item-label class="text-grey-7">
            {{ project.id }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-if="projects.length === 0"
        data-cy="item-empty"
      >
        <q-item-section>
          <q-item-label class="text-grey-7">
            {{ $t('page.home.drawer.empty') }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import { getProjects } from 'src/composables/Project';
import ProjectEvent from 'src/composables/events/ProjectEvent';

const projects = ref([]);
let updateProjectSubscription;

/**
 * Update projects list with the first four projects in alphabetical order.
 */
function updateProjects() {
  projects.value = Object.entries(getProjects())
    .map(([, project]) => project)
    .sort((projectA, projectB) => projectA.id.localeCompare(projectB.id))
    .slice(0, 4);
}

onMounted(() => {
  updateProjects();
  updateProjectSubscription = ProjectEvent.UpdateProjectEvent.subscribe(updateProjects);
});

onUnmounted(() => {
  updateProjectSubscription.unsubscribe();
});
</script>
