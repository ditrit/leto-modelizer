<template>
  <q-header
    class="bg-primary text-white shadow-1 row justify-between items-center q-px-lg"
    data-cy="navigation-bar"
  >
    <div>
      <router-link
        class="home-page-link"
        to="/"
        data-cy="home-page-link"
      >
        <q-icon
          color="primary"
          size="4rem"
          name="img:icons/logo_modelizer.svg"
          :left="true"
        />
        <label class="icon-label vertical-middle text-subtitle1">
          {{ $t('application.name') }}
        </label>
      </router-link>
    </div>
    <div class="project-info">
      <span
        class="project-name"
        data-cy="project-name"
      >
        {{ props.projectName }}
      </span>
    </div>
    <div class="row justify-between items-center">
      <q-btn
        v-if="isUploadButtonVisible"
        :disable="isUploadButtonDisable"
        :loading="isLoading"
        :label="$t('page.modelizer.header.button.upload.label')"
        :title="$t(uploadButtonTitle)"
        color="positive"
        class="q-mr-md"
        data-cy="upload-to-git-button"
        @click="upload()"
      >
        <template #loading>
          <q-spinner-dots />
        </template>
      </q-btn>
      <q-btn-toggle
        v-if="buttonToggleValue"
        v-model="buttonToggleValue"
        :options="buttonToggleOptions"
        class="view-selector q-mr-md"
        toggle-color="accent"
        text-color="accent"
        color="white"
        no-caps
        rounded
        data-cy="modelizer-switch-button"
        @update:model-value="onViewTypeUpdate"
      />
      <modelizer-settings-menu :project-name="projectName" />
    </div>
  </q-header>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import ModelizerSettingsMenu from 'components/menu/ModelizerSettingsMenu.vue';
import FileEvent from 'src/composables/events/FileEvent';
import { Notify } from 'quasar';
import {
  getProjectById,
  gitGlobalUpload,
} from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

let addRemoteSubscription;
let authenticationSubscription;

const query = computed(() => route.query);
const isLoading = ref(false);
const project = ref(getProjectById(props.projectName));
const buttonToggleValue = ref(route.params.viewType);
const buttonToggleOptions = computed(() => [{
  label: t('page.modelizer.header.switch.draw'),
  value: 'draw',
  slot: 'content',
}, {
  label: t('page.modelizer.header.switch.text'),
  value: 'text',
  slot: 'content',
}]);
const isUploadButtonVisible = computed(() => !!project.value.git && !!project.value.git.repository);
const isUploadButtonDisable = computed(() => !project.value.git || !project.value.git.username
  || !project.value.git.token);
const uploadButtonTitle = computed(() => {
  if (isUploadButtonDisable.value) {
    return 'page.modelizer.header.button.upload.disable.title';
  }
  return 'page.modelizer.header.button.upload.enable.title';
});

/**
 * Upload global modifications and notify according to the result.
 */
async function upload() {
  isLoading.value = true;

  await gitGlobalUpload(project.value)
    .then(() => {
      FileEvent.GlobalUploadFilesEvent.next();
      Notify.create({
        type: 'positive',
        message: t('page.modelizer.header.button.upload.success'),
        html: true,
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('page.modelizer.header.button.upload.error'),
        html: true,
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

/**
 * Update url with the new view type.
 *
 * @param {string} newViewType - 'draw' or 'text'.
 */
function onViewTypeUpdate(newViewType) {
  router.push({
    name: 'modelizer',
    params: {
      viewType: newViewType,
      projectName: props.projectName,
    },
    query: query.value,
  });
}

/**
 * Set project.
 */
function setProject() {
  project.value = getProjectById(props.projectName);
}

onMounted(() => {
  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(setProject);
  authenticationSubscription = GitEvent.AuthenticationEvent.subscribe(setProject);
});

onUnmounted(() => {
  addRemoteSubscription.unsubscribe();
  authenticationSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.q-header {
  position: relative;
}
.home-page-link {
  text-decoration: none;

  .icon-label{
    cursor: pointer;
    color: white;
    font-size: medium;
  }
}
.project-name {
  font-weight: bold;
  font-size: large;
}
</style>
