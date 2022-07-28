<template>
  <router-link
    class="card-link"
    :data-cy="`project-card-${project.id}`"
    :to="`/modelizer/${project.id}/model`"
  >
    <q-card
      v-ripple
      tabindex="0"
      class="cursor-pointer project-card"
    >
      <q-card-section>
        <div class="text-h6" data-cy="project-card-title">{{ project.id }}</div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
}
</style>
