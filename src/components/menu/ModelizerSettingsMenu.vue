<template>
  <q-btn-dropdown
    rounded
    auto-close
    color="white"
    text-color="primary"
    class="q-pa-xs"
    data-cy="modelizer-settings-button"
  >
    <template #label>
      <q-avatar
        v-if="!(userStore?.isEmpty)"
        color="primary"
        text-color="white"
        size="md"
        font-size="12px"
        :title="userStore.login"
      >
        <template v-if="HAS_BACKEND">
          <q-img
            v-if="userPicture"
            :src="userPicture"
            :alt="userStore.login"
          />
        </template>
        <template v-else>
          {{ userStore.name?.at(0) }}
        </template>
      </q-avatar>
      <q-avatar
        v-else
        color="grey"
        text-color="white"
        icon="fa-solid fa-user"
        size="md"
        font-size="12px"
        :title="$t('page.modelizer.settings.user.unknown')"
      />
    </template>
    <q-list>
      <q-item
        v-if="!(userStore?.isEmpty)"
      >
        <q-item-section>
          <q-item-label overline>
            {{ userStore.name }}
          </q-item-label>
          <q-item-label caption>
            {{ userStore.login }}
          </q-item-label>
          <q-item-label
            v-if="userStore.email"
            caption
          >
            {{ userStore.email }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-else>
        <q-item-section>
          <q-item-label overline>
            {{ $t('page.modelizer.settings.user.unknown') }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <template
        v-for="menuItem in menuItems"
        :key="menuItem.key"
      >
        <q-item
          v-if="menuItem.visible"
          clickable
          class="settings-item"
          :data-cy="`item_${menuItem.key}`"
          @click="onClick(menuItem.key)"
        >
          <q-item-section avatar>
            <q-icon
              color="primary"
              :name="menuItem.icon"
            />
          </q-item-section>
          <q-item-section no-wrap>
            {{ $t(menuItem.title) }}
          </q-item-section>
        </q-item>
      </template>
      <q-item
        v-can:admin
        clickable
        class="settings-item"
        data-cy="item_admin"
        @click="$router.push('/admin')"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            name="fa-solid fa-users-gear"
          />
        </q-item-section>
        <q-item-section no-wrap>
          {{ $t('page.modelizer.settings.admin.title') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
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
import { useUserStore } from 'src/stores/UserStore';
import { getUserPicture } from 'src/services/ImageDownloadService';

const props = defineProps({
  projectName: {
    type: String,
    default: null,
  },
});

let addRemoteSubscription;
const project = ref({});
const userStore = ref({});
const userPicture = ref(null);
const hasRepository = computed(() => !!project.value?.git?.repository);
const HAS_BACKEND = computed(() => process.env.HAS_BACKEND);
const menuItems = computed(() => [
  {
    key: 'GitAddRemote',
    icon: 'fa-solid fa-book-bookmark',
    title: 'page.modelizer.settings.gitAddRemote.title',
    visible: !hasRepository.value && !!props.projectName,
  },
  {
    key: 'GitAuthentication',
    icon: 'fa-brands fa-git-alt',
    title: 'page.modelizer.settings.gitAuthentication.title',
    visible: !!props.projectName,
  },
]);

/**
 * Send event to open the dialog corresponding to the key.
 * @param {string} key - Event key.
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
/**
 * Load user picture by its login.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUserPicture() {
  return getUserPicture({ HAS_BACKEND: process.env.HAS_BACKEND }, userStore.value.login)
    .then((picture) => {
      userPicture.value = picture;
    })
    .catch(() => {
      userPicture.value = null;
    });
}

onMounted(async () => {
  setProject();

  userStore.value = useUserStore();

  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(setProject);

  await loadUserPicture();
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
