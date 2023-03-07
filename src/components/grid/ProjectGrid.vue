<template>
  <div class="project-grid">
    <div>
      <div class="row items-center">
        <h4>{{ $t('page.home.project.title') }}</h4>
        <q-btn
          outline
          no-caps
          class="q-ml-xl"
          color="primary"
          icon="fa-solid fa-plus"
          :label="$t('actions.home.newProject')"
          @click="DialogEvent.next({ type: 'open', key: 'CreateProject' })"
          data-cy="create-project-button"
        />
        <q-btn
          outline
          no-caps
          class="q-ml-sm"
          color="primary"
          icon="fa-solid fa-cloud-arrow-down"
          :label="$t('actions.home.importProject')"
          @click="DialogEvent.next({ type: 'open', key: 'ImportProject' })"
          data-cy="import-project-button"
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
        v-if="Object.keys(projects).length === 0"
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
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.empty-grid {
  margin-top: 5vh;
}
</style>
