<template>
  <q-form
      @submit="onSubmit"
      data-cy="git-form"
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
          data-cy="git-form-submit"
          color="positive"/>
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { notEmpty, isGitRepositoryUrl } from 'src/composables/QuasarFieldRule';
import { getProjectById, saveProject } from 'src/composables/Project';

const emit = defineEmits(['project-git:save']);

const props = defineProps({
  projectName: String,
});

const project = getProjectById(props.projectName);
const repository = ref(project.git?.repository);
const username = ref(project.git?.username);
const token = ref(project.git?.token);

function onSubmit() {
  project.git = {
    repository: repository.value,
    username: username.value,
    token: token.value,
  };
  saveProject(project);
  emit('project-git:save');
}

</script>

<style lang="scss">
.git-form {
  min-width: 400px;
}
</style>
