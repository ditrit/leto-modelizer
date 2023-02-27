<template>
  <router-link
    class="card-link"
    :data-cy="`project-card-${project.id}`"
    :to="`/modelizer/${project.id}/models`"
  >
    <q-card
      v-ripple
      tabindex="0"
      class="cursor-pointer project-card"
      data-cy="project-card"
    >
      <q-img :src="getProjectImage()" height="100%">
        <div
          class="absolute-bottom text-subtitle2 text-center"
          data-cy="project-card-title"
        >
          <div>
            {{ project.id }}
          </div>
          <q-btn
            round
            color="negative"
            size="xs"
            icon="fa-solid fa-trash"
            :title="$t('actions.home.deleteProject.title')"
            :data-cy="`delete-project-${project.id}`"
            @click.stop.prevent="DialogEvent.next({
              type: 'open',
              key: 'DeleteProject',
              id: project.id,
            })"
          />
        </div>
      </q-img>
    </q-card>
  </router-link>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';

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
