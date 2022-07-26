<template>
  <q-page class="flex column justify-between home-page">
    <div class="fit flex justify-center items-center home-banner">
      <q-img
          src="icons/logo_modelizer.svg"
          class="home-logo"
          :ratio="1"
      />
    </div>
    <div class="flex home-content">
      <q-btn
        color="primary"
        size="xl"
        icon="fa-solid fa-circle-plus"
        data-cy="createEmptyProject"
        :label="$t('actions.home.createEmptyProject')"
        :to="`/modelizer/${project.id}/model`"
        @click="updateProject(project)"
      />
      <div class="fit row justify-center">
        <ProjectList
          class="col-md-8 project-list"
          :projects="getProjects()"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ProjectList from 'src/components/ProjectList';
import { createProjectTemplate, getProjects, updateProject } from 'src/composables/Project';

const project = createProjectTemplate();
</script>

<style lang="scss" scoped>
.home-page {
  .home-banner {
    background-color: $primary;
    flex: 1;
  }
  .home-logo {
    width: 144px;
    height: 174px;
  }
  .home-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin: 5vh;
  }
}
</style>
