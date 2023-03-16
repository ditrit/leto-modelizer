<template>
  <q-form
    @submit="onSubmit"
    class="q-gutter-md create-project-template-form"
    data-cy="create-project-template-form"
  >
    <q-input
      v-model="projectName"
      :label="$t('page.home.project.name')"
      :rules="[
        v => notEmpty($t, v),
        v => isUniqueProjectName($t, projectNames, v)
      ]"
      filled
      lazy-rules
      data-cy="name-input"
    />
    <q-checkbox
      v-model="localIsChecked"
      class="q-mb-sm"
      :label="$t('page.home.template.import')"
      data-cy="import-project-checkbox"
    />
    <template
      v-if="isChecked"
    >
      <q-input
        v-model="repository"
        :label="$t('page.modelizer.settings.gitAddRemote.repository')"
        :hint="$t('page.modelizer.settings.gitAddRemote.repositoryExample')"
        :rules="[v => notEmpty($t, v), v => isGitRepositoryUrl($t, v)]"
        filled
        lazy-rules
        data-cy="repository-input"
      />
      <q-input
        v-model="username"
        :label="$t('page.modelizer.settings.gitAuthentication.username')"
        filled
        lazy-rules
        data-cy="username-input"
      />
      <q-input
        v-model="token"
        :label="$t('page.modelizer.settings.gitAuthentication.token')"
        filled
        lazy-rules
        data-cy="token-input"
      />
    </template>
    <div class="flex row items-center justify-center">
      <q-btn
        :label="$t(`actions.home.createProject`)"
        :loading="submitting"
        icon="fa-solid fa-save"
        type="submit"
        color="positive"
        data-cy="submit-button"
      >
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
import { ref, watch } from 'vue';
import {
  notEmpty,
  isGitRepositoryUrl,
  isUniqueProjectName,
} from 'src/composables/QuasarFieldRule';
import {
  importProject,
  appendProjectFile,
  initProject,
  getProjects,
} from 'src/composables/Project';
import { getTemplateFileByPath } from 'src/composables/TemplateManager';
import { FileInput } from 'leto-modelizer-plugin-core';

const emit = defineEmits(['project:add', 'update:checked']);

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const project = {};
const projectName = ref('');
const projectNames = ref(Object.keys(getProjects()));
const localIsChecked = ref(props.isChecked);
const repository = ref();
const username = ref();
const token = ref();
const submitting = ref(false);

/**
 * Create a new project, emit new project id, manage toast and loader.
 */
function onSubmit() {
  submitting.value = true;

  project.id = projectName.value;
  project.git = {
    repository: repository.value,
    username: username.value,
    token: token.value,
  };

  const addProject = localIsChecked.value
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
        message: t(`actions.home.${localIsChecked.value ? 'imported' : 'created'}Project`),
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

watch(() => localIsChecked.value, () => {
  if (localIsChecked.value !== props.isChecked) {
    emit('update:checked', localIsChecked.value);
  }
});

watch(() => props.isChecked, () => {
  localIsChecked.value = props.isChecked;
});
</script>

<style lang="scss" scoped>
.create-project-template-form {
  min-width: 400px;
}
</style>
