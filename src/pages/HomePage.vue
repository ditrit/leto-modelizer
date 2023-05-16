<template>
  <q-page class="home-page">
    <div class="column items-center home-content">
      <div class="fit row justify-center">
        <project-grid
          class="col-md-8"
          :projects="projects"
        />
      </div>
      <div class="fit row justify-center q-mt-lg">
        <template-grid
          class="col-md-8"
          :templates="templates"
          @add:template="openCreateProjectTemplateDialog"
        >
          <template #header>
            <h4>
              {{ $t('page.home.template.createProject') }}
            </h4>
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
import ProjectGrid from 'src/components/grid/ProjectGrid';
import TemplateGrid from 'src/components/grid/TemplateGrid';
import { getProjects } from 'src/composables/Project';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import ImportProjectDialog from 'components/dialog/ImportProjectDialog';
import CreateProjectTemplateDialog from 'components/dialog/CreateProjectTemplateDialog';
import CreateProjectDialog from 'components/dialog/CreateProjectDialog';
import DeleteProjectDialog from 'components/dialog/DeleteProjectDialog';
import ProjectEvent from 'src/composables/events/ProjectEvent';
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import RenameProjectDialog from 'components/dialog/RenameProjectDialog';
import DialogEvent from 'src/composables/events/DialogEvent';

const templates = ref([]);
const projects = ref({});
let updateProjectSubscription;

/**
 * Set projects.
 */
function setProjects() {
  projects.value = getProjects();
}

/**
 * Open CreateProjectTemplate dialog.
 * @param {Object} template - Selected project template.
 */
async function openCreateProjectTemplateDialog(template) {
  DialogEvent.next({
    type: 'open',
    key: 'CreateProjectTemplate',
    template,
  });
}

onMounted(async () => {
  templates.value = await getTemplatesByType('project');
  setProjects();
  updateProjectSubscription = ProjectEvent.UpdateProjectEvent.subscribe(setProjects);
});

onUnmounted(() => {
  updateProjectSubscription.unsubscribe();
});
</script>
