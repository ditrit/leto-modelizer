<template>
  <q-page class="flex column justify-between home-page">
    <div class="fit flex justify-center items-center home-banner">
      <q-img
        src="icons/logo_modelizer.svg"
        class="home-logo"
        :ratio="1"
      />
    </div>
    <div class="column items-center home-content">
      <q-btn
        color="primary"
        size="xl"
        icon="fa-solid fa-circle-plus"
        data-cy="create-empty-project"
        :label="$t('actions.home.createEmptyProject')"
        @click="createProject"
      />
      <div class="fit row justify-center">
        <ProjectGrid
          class="col-md-8"
          :projects="getProjects()"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ProjectGrid from 'src/components/grid/ProjectGrid';
import { createProjectTemplate, getProjects, initProject } from 'src/composables/Project';
import { useRouter } from 'vue-router';

const router = useRouter();

const project = createProjectTemplate();

async function createProject() {
  await initProject(project);
  return router.push(`/modelizer/${project.id}/model`);
}
</script>

<style lang="scss" scoped>
.home-page {
  .home-banner {
    background-color: $primary;
    min-height: 30vh;
    max-height: 50vh;
    flex: 1;
  }
  .home-logo {
    width: 144px;
    height: 174px;
  }
  .home-content {
    margin: 5vh;
    flex: 2;
  }
}
</style>
