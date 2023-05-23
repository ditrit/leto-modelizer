<template>
  <div class="project-grid">
    <div>
      <div class="row items-center">
        <h4>
          {{ $t('page.home.project.title') }}
        </h4>
        <q-btn
          outline
          no-caps
          class="q-ml-xl"
          color="primary"
          icon="fa-solid fa-plus"
          :label="$t('actions.home.newProject')"
          data-cy="create-project-button"
          @click="DialogEvent.next({ type: 'open', key: 'CreateProject' })"
        />
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
      <div class="row">
        <project-card
          v-for="project in projects"
          :key="project.id"
          :project="project"
          class="q-ma-sm"
        />
      </div>
      <div
        v-if="projects.length === 0"
        class="row text-center text-h6 text-grey empty-grid"
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

defineProps({
  projects: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.empty-grid {
  margin-top: 5vh;
}
</style>
