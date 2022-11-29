<template>
  <div class="project-grid">
    <div>
      <div class="row items-center">
        <h4>{{ $t('page.home.recentProjects') }}</h4>
        <q-btn
          outline
          no-caps
          class="q-ml-xl"
          color="primary"
          icon="fa-solid fa-plus"
          data-cy="new-project"
          :label="$t('actions.home.newProject')"
          @click="createProject"
        />
        <q-btn
          outline
          no-caps
          class="q-ml-sm"
          color="primary"
          icon="fa-solid fa-cloud-arrow-down"
          data-cy="import-project"
          :label="$t('actions.home.importProject')"
          @click="DialogEvent.next({ type: 'open', key: 'ImportProject' })"
        />
      </div>
      <div class="row">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          class="q-ma-sm"
        />
      </div>
      <div
        v-if="Object.keys(projects).length === 0"
        class="row text-center text-h6 text-grey empty-grid"
      >
        {{ $t('projects.empty') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import ProjectCard from 'src/components/card/ProjectCard.vue';
import { useRouter } from 'vue-router';
import { createProjectTemplate, initProject } from 'src/composables/Project';
import DialogEvent from 'src/composables/events/DialogEvent';

defineProps({
  projects: {
    type: Object,
    required: true,
  },
});
const router = useRouter();

/**
 * Create project on fs, init project on git and redirect to project page.
 */
async function createProject() {
  const project = createProjectTemplate();
  await initProject(project);
  router.push(`/modelizer/${project.id}/model`);
}
</script>

<style scoped>
.empty-grid {
  margin-top: 5vh;
}
</style>
