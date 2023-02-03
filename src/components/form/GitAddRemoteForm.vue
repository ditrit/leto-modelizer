<template>
  <q-form
    @submit="onSubmit"
    data-cy="git-add-remote-form"
    class="q-gutter-md"
  >
    <div class="warning-message row items-center bg-warning q-py-sm">
      <q-icon
        name="fa-solid fa-triangle-exclamation"
        class="q-pr-xs"
      >
      </q-icon>
      {{ $t('page.modelizer.settings.gitAddRemote.warningMessage') }}
    </div>
    <q-input
      filled
      v-model="repository"
      :label="$t('page.modelizer.settings.gitAddRemote.repository')"
      lazy-rules
      data-cy="git-repository-input"
      :hint="$t('page.modelizer.settings.gitAddRemote.repositoryExample')"
      :rules="[v => notEmpty($t, v), v => isGitRepositoryUrl($t, v)]"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.save')"
        type="submit"
        :loading="submitting"
        data-cy="git-form-submit"
        color="positive">
        <template v-slot:loading>
          <q-spinner-dots/>
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import {
  notEmpty,
  isGitRepositoryUrl,
} from 'src/composables/QuasarFieldRule';
import {
  getProjectById,
  saveProject,
  gitAddRemote,
} from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';

const emit = defineEmits(['project-git:save']);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const project = getProjectById(props.projectName);
const repository = ref(project.git?.repository);
const submitting = ref(false);

/**
 * Add git remote to the project, manage toast and loader.
 */
function onSubmit() {
  submitting.value = true;
  project.git = {
    repository: repository.value,
    username: project.git?.username,
    token: project.git?.token,
  };
  return gitAddRemote(project)
    .then(() => {
      saveProject(project);
      emit('project-git:save');
      GitEvent.AddRemoteEvent.next();
      Notify.create({
        type: 'positive',
        message: t('actions.git.repository.exists'),
        html: true,
      });
    })
    .catch(({ name }) => {
      Notify.create({
        type: 'warning',
        message: t(`errors.git.${name}`),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
    });
}

</script>

<style scoped lang="scss">
.warning-message {
  border-radius: 4px;
  padding: 8px 12px;
}
</style>