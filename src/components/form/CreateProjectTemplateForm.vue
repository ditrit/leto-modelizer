<template>
  <q-form
    class="create-project-template-form"
    data-cy="create-project-template-form"
    @submit="onSubmit"
  >
    <div class="row q-gutter-md">
      <div class="flex-2">
        <div class="text-subtitle2">
          {{ $t('page.home.template.rename') }}
        </div>
        <q-input
          v-model="projectName"
          :label="$t('page.home.project.name')"
          :rules="[
            v => notEmpty($t, v),
            v => isUniqueProjectName($t, projectNames, v)
          ]"
          outlined
          lazy-rules
          data-cy="name-input"
        />
        <div class="text-subtitle2 q-mb-md">
          {{ $t('page.home.template.description') }}
        </div>
        <q-input
          v-model="templateDescription"
          filled
          disable
          data-cy="content-input"
        />
      </div>
      <div class="flex-1">
        <plugins-card
          :plugins="template.plugins"
          class="bg-grey-3 text-grey-8 no-shadow"
        />
      </div>
    </div>
    <q-checkbox
      v-model="localIsChecked"
      class="q-mb-sm"
      :label="$t('page.home.template.import')"
      data-cy="import-project-checkbox"
    />
    <div
      v-if="isChecked"
      class="column q-gutter-md"
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
    </div>
    <div class="row items-center justify-between q-mt-md">
      <q-btn
        v-close-popup
        :label="$t(`actions.default.cancel`)"
        flat
        type="reset"
        color="negative"
        data-cy="cancel-button"
      />
      <q-btn
        :label="$t(`actions.default.create`)"
        :loading="submitting"
        icon="fa-solid fa-save"
        type="submit"
        color="positive"
        data-cy="submit-button"
      >
        <template #loading>
          <q-spinner-dots />
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
import PluginsCard from 'src/components/card/PluginsCard.vue';

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
const templateDescription = ref(props.template.description);
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
.flex-1 {
  flex: 1;
}
.flex-2 {
  flex: 2;
}
</style>
