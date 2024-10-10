<template>
  <router-link
    class="card-link"
    :to="`projects/${project.id}/models`"
  >
    <q-card
      tabindex="0"
      class="cursor-pointer project-card"
      :data-cy="`project-card_${project.id}`"
    >
      <q-img
        :src="getProjectImage()"
        height="120px"
        width="120px"
        class="project-image"
        @click="(event) => $emit('click', event)"
      />
      <div class="absolute-bottom q-py-xs row justify-center project-menu">
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
          class="q-mr-md"
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
        <q-btn
          v-if="!props.project.isFavorite"
          class="q-mr-none"
          :title="$t('actions.home.setFavorite')"
          size="xs"
          round
          color="pink"
          icon="fa-solid fa-heart-circle-plus"
          data-cy="setFavorite-button"
          @click.stop.prevent="setFavorite(true)"
        />
        <q-btn
          v-else
          class="q-mr-none"
          :title="$t('actions.home.unsetFavorite')"
          size="xs"
          round
          color="pink"
          icon="fa-solid fa-heart-circle-minus"
          data-cy="unsetFavorite-button"
          @click.stop.prevent="setFavorite(false)"
        />
      </div>
      <div
        class="project-title text-subtitle2 text-center ellipsis-2-lines"
        data-cy="title-container"
      >
        {{ project.id }}
      </div>
      <div
        class="bookmark-status"
        :title="$t(bookmarkStatusTitle)"
      >
        <q-icon
          name="fa-solid fa-bookmark"
          color="primary"
          class="icon-shadow"
          size="28px"
        />
        <q-icon
          :name="bookmarkStatusIcon"
          color="white"
          size="12px"
          class="bookmark-icon"
        />
      </div>
      <div
        v-if="props.project.isFavorite"
        class="bookmark-preferred"
        :title="$t('page.home.project.favorite')"
      >
        <q-icon
          name="fa-solid fa-bookmark"
          class="icon-shadow"
          color="pink"
          size="28px"
        />
        <q-icon
          name="fa-solid fa-heart"
          color="white"
          size="12px"
          class="bookmark-icon"
        />
      </div>
    </q-card>
  </router-link>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import jdenticon from 'jdenticon/standalone';
import { saveProject } from 'src/composables/Project';
import { computed } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['click', 'reloadProjects']);
const isRemote = computed(() => props.project.git.repository !== null);
const bookmarkStatusTitle = computed(() => (isRemote.value ? 'page.home.project.remote' : 'page.home.project.local'));
const bookmarkStatusIcon = computed(() => (isRemote.value ? 'fa-solid fa-cloud' : 'fa-solid fa-house-chimney'));

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

/**
 * Toggle project favorite status.
 * @param {boolean} state - State of favorite.
 */
function setFavorite(state) {
  saveProject({
    ...props.project,
    isFavorite: state,
  });
  emit('reloadProjects');
}

</script>

<style lang="scss" scoped>
.project-card {
  width: 150px;
  height: 150px;
  transition: filter 0.3s ease;
}
.project-card:hover {
  filter: brightness(85%);
}

.q-img__content > div {
  padding: 4px 0 4px 0;
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.project-menu {
  margin-top: 30px;
  background: white;
  border-top: 1px solid grey;
}

.project-image {
  margin-left: 15px;
}

.project-title {
  margin-top: 30px;
}

.bookmark-preferred {
  position: absolute;
  top: 0;
  left: 32px;
  cursor: help;
}

.bookmark-status {
  position: absolute;
  top: 0;
  left: 5px;
  cursor: help;
}

.bookmark-icon {
  position: absolute;
  top: 5px;
  left: 8px;
}

.project-icon {
  right: 5px;
  top: 32px;
  border: 1px solid $primary;
  border-radius: 2px;
  background: white;
}
</style>
<style lang="scss">
.icon-shadow {
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.7));
}

.project-menu {
  i.q-icon {
    margin-top: 2px;
    margin-left: 1px;

    &.fa-heart-circle-minus, &.fa-heart-circle-plus {
      margin-top: 2px;
      margin-left: 2px;
    }
  }
}
</style>
