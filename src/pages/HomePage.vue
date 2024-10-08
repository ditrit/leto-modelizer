<template>
  <q-page class="home-page bg-grey-2">
    <div class="column items-start home-content q-mx-md">
      <div class="row grid-container">
        <project-grid
          class="col-md-8"
          :projects="projects"
        />
      </div>
      <div class="row q-my-md grid-container">
        <template-grid
          class="q-mr-md"
          type="PROJECT"
          @add:template="openCreateProjectTemplateDialog"
        >
          <template #header>
            {{ $t('page.home.template.createProject') }}
          </template>
        </template-grid>
      </div>
    </div>
    <import-project-dialog />
    <create-project-template-dialog />
    <create-project-dialog />
    <delete-project-dialog />
    <rename-project-dialog />
  </q-page>
</template>

<script setup>
import ProjectGrid from 'src/components/grid/ProjectGrid.vue';
import TemplateGrid from 'src/components/grid/TemplateGrid.vue';
import { getProjects } from 'src/composables/Project';
import ImportProjectDialog from 'components/dialog/ImportProjectDialog.vue';
import CreateProjectTemplateDialog from 'components/dialog/CreateProjectTemplateDialog.vue';
import CreateProjectDialog from 'components/dialog/CreateProjectDialog.vue';
import DeleteProjectDialog from 'components/dialog/DeleteProjectDialog.vue';
import ProjectEvent from 'src/composables/events/ProjectEvent';
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import RenameProjectDialog from 'components/dialog/RenameProjectDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

const projects = ref([]);
let updateProjectSubscription;

/**
 * Update project list, sorted by creation date from newest to oldest.
 */
function setProjects() {
  projects.value = Object.entries(getProjects())
    .map(([, project]) => project)
    .sort((projectA, projectB) => projectB.creationDate - projectA.creationDate);
}

/**
 * Open CreateProjectTemplate dialog.
 * @param {object} template - Selected project template.
 */
async function openCreateProjectTemplateDialog(template) {
  DialogEvent.next({
    type: 'open',
    key: 'CreateProjectTemplate',
    template,
  });
}

onMounted(async () => {
  setProjects();
  updateProjectSubscription = ProjectEvent.UpdateProjectEvent.subscribe(setProjects);
});

onUnmounted(() => {
  updateProjectSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.grid-container {
  width: 100%;
  max-width: 1275px;

  .project-grid, .template-grid {
    width: 100%;
  }
}
</style>
