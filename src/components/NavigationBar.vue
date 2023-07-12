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
        <q-img class="logo" />
        <label class="icon-label vertical-middle text-subtitle1">
          {{ $t('application.name') }}
        </label>
      </router-link>
      <a :href="getFeedbacksUrl()" target="_blank">
        <q-btn
          outline
          no-caps
          class="q-ml-xl"
          color="primary"
          icon="fa-solid fa-envelope"
          :label="$t('page.modelizer.header.button.feedbacks.label')"
          :title="$t('page.modelizer.header.button.feedbacks.title')"
          data-cy="feedbacks-button"
        />
      </a>
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
        v-if="isInstallPipelinesButtonVisible"
        :loading="isInstallPipelinesLoading"
        :label="$t('page.modelizer.header.button.installPipelines.label')"
        :title="$t('page.modelizer.header.button.installPipelines.title')"
        @click="installPipelines()"
        color="white"
        text-color="positive"
        class="q-mr-xl"
        data-cy="install-pipelines-button"
      >
        <template v-slot:loading>
          <q-spinner-dots/>
        </template>
      </q-btn>
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
  toRef,
} from 'vue';
import { useI18n } from 'vue-i18n';
import ModelizerSettingsMenu from 'components/menu/ModelizerSettingsMenu.vue';
import FileEvent from 'src/composables/events/FileEvent';
import { Notify } from 'quasar';
import {
  getProjectById,
  getCurrentBranch,
  gitGlobalUpload,
  getFeedbacksUrl,
  jenkinsCascApplyAll,
} from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';
import { useRoute, useRouter } from 'vue-router';
import JenkinsEvent from 'src/composables/events/JenkinsEvent';

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
let jenkinsAuthenticationSubscription;

const query = computed(() => route.query);
const isLoading = ref(false);
const isInstallPipelinesLoading = ref(false);
const project = ref(getProjectById(toRef(props, 'projectName').value));
const buttonToggleValue = ref(['Draw', 'Text'].includes(route.name) ? route.name : null);
const buttonToggleOptions = computed(() => [{
  label: t('page.modelizer.header.switch.draw'),
  value: 'Draw',
  slot: 'content',
}, {
  label: t('page.modelizer.header.switch.text'),
  value: 'Text',
  slot: 'content',
}]);
const isUploadButtonVisible = computed(() => !!project.value.git?.repository);
const isUploadButtonDisable = computed(() => !project.value.git?.username
  || !project.value.git?.token);
const isInstallPipelinesButtonVisible = computed(() => !!project.value.jenkins
  && !!project.value.jenkins.url
  && !!project.value.jenkins.username
  && !!project.value.jenkins.token);
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
        message: t('page.modelizer.header.button.upload.success.message'),
        html: true,
        timeout: 0,
        actions: [
          {
            label: t('page.modelizer.header.button.upload.success.actionLabel'),
            color: 'white',
            handler: async () => window.open(`${project.value.git.repository}/compare/${await getCurrentBranch(project.value.id)}`, '_blank').focus(),
          },
          {
            label: t('actions.default.close'),
            color: 'white',
          },
        ],
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

async function installPipelines() {
  isInstallPipelinesLoading.value = true;

  await jenkinsCascApplyAll(project.value)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('page.modelizer.header.button.installPipelines.success.message'),
        html: true,
        timeout: 0,
        actions: [
          {
            label: t('page.modelizer.header.button.installPipelines.success.actionLabel'),
            color: 'white',
            handler: () => {
              window.open(project.value.jenkins.url, '_blank').focus();
            },
          },
          {
            label: t('actions.default.close'),
            color: 'white',
          },
        ],
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('page.modelizer.header.button.installPipelines.error.message'),
        html: true,
        timeout: 0,
        actions: [
          {
            label: t('page.modelizer.header.button.installPipelines.error.actionLabel'),
            color: 'white',
            handler: () => {
              window.open(`${project.value.jenkins.url}/log/all`, '_blank').focus();
            },
          },
          {
            label: t('actions.default.close'),
            color: 'white',
          },
        ],
      });
    })
    .finally(() => {
      isInstallPipelinesLoading.value = false;
    });
}

/**
 * Update url with the new view type.
 * @param {string} newViewType - 'draw' or 'text'.
 */
async function onViewTypeUpdate(newViewType) {
  await router.push({
    name: newViewType,
    params: {
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
  jenkinsAuthenticationSubscription = JenkinsEvent.AuthenticationEvent.subscribe(setProject);
});

onUnmounted(() => {
  addRemoteSubscription.unsubscribe();
  authenticationSubscription.unsubscribe();
  jenkinsAuthenticationSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.bg-primary {
  background: #15314D !important;
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
