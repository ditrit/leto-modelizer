<template>
  <q-page class="home-page bg-grey-2">
    <div class="column items-center home-content">
      <div class="row grid-container">
        <project-grid />
      </div>
      <div class="row grid-container">
        <template-grid
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
import ImportProjectDialog from 'components/dialog/ImportProjectDialog.vue';
import CreateProjectTemplateDialog from 'components/dialog/CreateProjectTemplateDialog.vue';
import CreateProjectDialog from 'components/dialog/CreateProjectDialog.vue';
import DeleteProjectDialog from 'components/dialog/DeleteProjectDialog.vue';
import RenameProjectDialog from 'components/dialog/RenameProjectDialog.vue';
import DialogEvent from 'src/composables/events/DialogEvent';

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
</script>

<style lang="scss" scoped>
.grid-container {
  width: 100%;
  padding-left: 10%;
  padding-right: 10%;

  .project-grid, .template-grid {
    width: 100%;
  }
}
</style>
