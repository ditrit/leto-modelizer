<template>
  <q-form
    @submit="onSubmit"
    data-cy="git-settings-form"
    class="q-gutter-md git-form">
    <q-input
      filled
      v-model="repository"
      :label="$t('page.modelizer.settings.gitProvider.repository')"
      lazy-rules
      data-cy="git-repository-input"
      :hint="$t('page.modelizer.settings.gitProvider.repositoryExample')"
      :rules="[v => notEmpty($t, v), v => isGitRepositoryUrl($t, v)]"
    />

    <q-input
      filled
      v-model="username"
      :label="$t('page.modelizer.settings.gitProvider.username')"
      lazy-rules
      data-cy="git-username-input"
      :rules="[v => notEmpty($t, v)]"
    />

    <q-input
      filled
      v-model="token"
      :label="$t('page.modelizer.settings.gitProvider.token')"
      lazy-rules
      data-cy="git-token-input"
      :rules="[v => notEmpty($t, v)]"
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
// TODO : RENAME GitForm to GitConfigurationForm
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { notEmpty, isGitRepositoryUrl } from 'src/composables/QuasarFieldRule';
import {
  getProjectById,
  saveProject,
  gitAddRemote,
} from 'src/composables/Project';
import GitEvent from 'src/composables/events/GitEvent';

const emit = defineEmits(['project-git:save']);

const props = defineProps({
  projectName: String,
});

const { t } = useI18n();
const project = getProjectById(props.projectName);
const repository = ref(project.git?.repository);
const username = ref(project.git?.username);
const token = ref(project.git?.token);
const submitting = ref(false);

function onSubmit() {
  submitting.value = true;
  project.git = {
    repository: repository.value,
    username: username.value,
    token: token.value,
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

<style lang="scss">
.git-form {
  min-width: 400px;
}
</style>
