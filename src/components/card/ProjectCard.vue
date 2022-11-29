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
      <q-img :src="getProjectImage()" height="100%">
        <div class="absolute-bottom text-subtitle2 text-center">
          {{ project.id }}
        </div>
      </q-img>
    </q-card>
  </router-link>
</template>

<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

/**
 * Get image of project.
 * Transform project name to a number between 0 and 4 and return associate image.
 * @return {String} Image path.
 */
function getProjectImage() {
  const number = props.project.id.split('')
    .map((char) => char.charCodeAt(0))
    .reduce((acc, value) => acc + value) % 5;
  return `images/project${number}.png`;
}
</script>

<style scoped>
.project-card {
  width: 150px;
  height: 150px;
}
.card-link {
  text-decoration: none;
  color: inherit;
}
</style>
