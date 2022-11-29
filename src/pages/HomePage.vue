<template>
  <q-page class="flex column justify-between home-page">
    <div class="fit flex justify-center items-center home-banner">
      <q-img
        src="icons/logo_modelizer.svg"
        class="home-logo"
        :ratio="1"
      />
      <h2 class="text-white">
        {{ $t('application.name') }}
      </h2>
    </div>
    <div class="column items-center home-content">
      <div class="fit row justify-center">
        <ProjectGrid
          class="col-md-8"
          :projects="getProjects()"
        />
      </div>
    </div>
    <import-project-dialog/>
  </q-page>
</template>

<script setup>
import ProjectGrid from 'src/components/grid/ProjectGrid';
import { getProjects } from 'src/composables/Project';
import ImportProjectDialog from 'components/dialog/ImportProjectDialog';
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
