<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md new-project-template-form"
    data-cy="new-project-template-form"
  >
    <template
      v-if="isImportAction"
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
    </template>
    <div class="flex row items-center justify-center">
      <q-btn
        :label="$t(`actions.home.createProject`)"
        :loading="submitting"
        icon="fa-solid fa-save"
        type="submit"
        data-cy="new-project-template-form-submit"
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
import {
  importProject,
  appendProjectFile,
  initProject,
} from 'src/composables/Project';
import { getTemplateFileByPath } from 'src/composables/TemplateManager';
import { FileInput } from 'leto-modelizer-plugin-core';
import { randomHexString } from 'src/composables/Random';

const emit = defineEmits(['project:add']);

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
  isImportAction: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const project = {};
const repository = ref();
const username = ref();
const token = ref();
const submitting = ref(false);

/**
 * Create a new project, emit new project id, manage toast and loader.
 */
function onSubmit() {
  submitting.value = true;

  const newProjectName = repository.value ? repository.value.split('/').at(-1) : 'project-template';

  project.id = `${newProjectName}-${randomHexString(8)}`;
  project.git = {
    repository: repository.value,
    username: username.value,
    token: token.value,
  };

  const addProject = props.isImportAction
    ? importProject(project)
    : initProject(project);

  return addProject
    .then(async () => {
      await Promise.allSettled(props.template.files
        .map((file) => getTemplateFileByPath(`templates/${props.template.key}/${file}`, 'text')
          .then(async (result) => {
            appendProjectFile(project.id, new FileInput({
              path: file,
              content: result.data,
            }));
          })
          .catch(() => {
            Notify.create({
              type: 'negative',
              message: t('errors.templates.getData'),
              html: true,
            });
          })));

      emit('project:add', project.id);
      Notify.create({
        type: 'positive',
        message: t(`actions.home.${props.isImportAction ? 'imported' : 'created'}Project`),
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
.new-project-template-form {
  min-width: 400px;
}
</style>
