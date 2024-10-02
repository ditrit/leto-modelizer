<template>
  <router-link
    class="card-link"
    :to="`projects/${project.id}/models`"
  >
    <q-card
      v-ripple
      tabindex="0"
      class="cursor-pointer project-card"
      :data-cy="`project-card_${project.id}`"
    >
      <q-img
        :src="getProjectImage()"
        height="100%"
      >
        <div
          class="absolute-bottom text-subtitle2 text-center"
          data-cy="title-container"
        >
          <div class="ellipsis-2-lines">
            {{ project.id }}
          </div>
          <q-btn
            class="q-mr-md"
            :title="$t('actions.home.deleteProject.title')"
            size="xs"
            round
            color="negative"
            icon="fa-solid fa-trash"
            data-cy="delete-button"
            @click.stop.prevent="DialogEvent.next({
              type: 'open',
              key: 'DeleteProject',
              id: project.id,
            })"
          />
          <q-btn
            class="q-mr-none"
            :title="$t('actions.home.renameProject.title')"
            size="xs"
            round
            color="primary"
            icon="fa-solid fa-pen"
            data-cy="rename-button"
            @click.stop.prevent="DialogEvent.next({
              type: 'open',
              key: 'RenameProject',
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
import jdenticon from 'jdenticon/standalone';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

/**
 * Get image of project.
 * Use JIdenticon to generate the project image.
 * @returns {string} Image value.
 */
function getProjectImage() {
  const image = jdenticon.toSvg(props.project.id, 200);
  const base64Data = btoa(image);

  return `data:image/svg+xml;base64,${base64Data}`;
}
</script>

<style scoped>
.project-card {
  width: 150px;
  height: 150px;
}

.q-img__content > div {
  padding: 0 0 4px 0;
}

.card-link {
  text-decoration: none;
  color: inherit;
}
</style>
