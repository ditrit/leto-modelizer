<template>
  <div class="project-grid">
    <q-table
      v-if="Object.keys(projects).length !== 0"
      :title="$t('projects.list')"
      grid
      :rows="Object.values(projects)"
      row-key="id"
      hide-header
      hide-bottom
      virtual-scroll
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:item="props">
        <ProjectCard
          class="q-pa-xs col-xs-12 col-sm-4 col-md-3"
          :project="props.row"
        />
      </template>
    </q-table>
    <div v-else caption class="text-center text-h6 text-grey empty-grid">
      {{ $t('projects.empty') }}
    </div>
  </div>
</template>

<script setup>
import ProjectCard from 'src/components/card/ProjectCard.vue';

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
