<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md import-project-form"
    data-cy="import-project-form"
  >
    <q-input
      v-model="repository"
      :label="$t('page.modelizer.settings.gitAddRemote.repository')"
      :hint="$t('page.modelizer.settings.gitAddRemote.repositoryExample')"
      :rules="[v => notEmpty($t, v), v => isGitRepositoryUrl($t, v)]"
      filled
      lazy-rules
      data-cy="git-repository-input"
    />
    <q-input
      v-model="username"
      :label="$t('page.modelizer.settings.gitAuthentication.username')"
      filled
      lazy-rules
      data-cy="git-username-input"
    />
    <q-input
      v-model="token"
      :label="$t('page.modelizer.settings.gitAuthentication.token')"
      filled
      lazy-rules
      data-cy="git-token-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        :label="$t('actions.home.importProject')"
        :loading="submitting"
        icon="fa-solid fa-save"
        type="submit"
        data-cy="import-project-form-submit"
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
import { notEmpty, isGitRepositoryUrl } from 'src/composables/QuasarFieldRule';
import { importProject } from 'src/composables/Project';

const emit = defineEmits(['project:import']);

const { t } = useI18n();
const project = {};
const repository = ref();
const username = ref();
const token = ref();
const submitting = ref(false);

/**
 * Import project, manage toast and loader.
 */
function onSubmit() {
  submitting.value = true;
  project.id = repository.value.split('/').at(-1);
  project.git = {
    repository: repository.value,
    username: username.value,
    token: token.value,
  };

  return importProject(project)
    .then(() => {
      emit('project:import', project.id);
      Notify.create({
        type: 'positive',
        message: t('actions.home.importedProject'),
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

<style lang="scss" scoped>
.import-project-form {
  min-width: 400px;
}
</style>
