<template>
  <q-btn
    round
    color="white"
    text-color="primary"
    icon="fa-solid fa-gear"
    data-cy="project-settings"
  >
    <q-menu auto-close>
      <q-list>
        <template
          v-for="menuItem in menuItems"
          :key="menuItem.key"
        >
          <q-item
            v-if="menuItem.visible"
            clickable
            class="settings-item"
            data-cy="git-settings-menu"
            @click="onClick(menuItem.key)"
          >
            <q-item-section avatar>
              <q-icon color="primary" :name="menuItem.icon" />
            </q-item-section>
            <q-item-section no-wrap>
              {{ $t(menuItem.title) }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import { getProjectById } from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
} from 'vue';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

let addRemoteSubscription;
const project = ref({});
const hasRepository = computed(() => !!project.value.git?.repository);
const menuItems = computed(() => [
  {
    key: 'GitAddRemote',
    icon: 'fa-solid fa-book-bookmark',
    title: 'page.modelizer.settings.gitAddRemote.title',
    visible: !hasRepository.value,
  },
  {
    key: 'GitAuthentication',
    icon: 'fa-brands fa-git-alt',
    title: 'page.modelizer.settings.gitAuthentication.title',
    visible: true,
  },
]);

/**
 * Send event to open the dialog corresponding to the key.
 * @param {String} key - Event key.
 */
function onClick(key) {
  DialogEvent.next({ type: 'open', key });
}

/**
 * Set project
 */
function setProject() {
  project.value = getProjectById(props.projectName);
}

onMounted(() => {
  setProject();
  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(setProject);
});

onUnmounted(() => {
  addRemoteSubscription.unsubscribe();
});
</script>

<style lang="scss">
.settings-item {
  user-select: none;
}
</style>
