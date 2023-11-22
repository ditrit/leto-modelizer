<template>
  <q-form
    class="q-gutter-md import-project-form"
    data-cy="import-project-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="repository"
      :label="$t('page.modelizer.settings.gitAddRemote.repository')"
      :rules="[
        (value) => notEmpty($t, value),
        (value) => isUrl($t, value),
        isUniqueRuleEnabled ?
          (value) => isUnique(
            $t,
            projectNames,
            extractProjectName(value),
            'errors.projects.duplicate.import'
          )
          : () => true,
      ]"
      filled
      reactive-rules
      data-cy="repository-input"
    />
    <q-checkbox
      v-if="isDuplicate"
      v-model="overwrite"
      class="q-mt-none"
      :label="$t('page.home.project.overwrite')"
      :disable="!isDuplicate"
      data-cy="overwrite-project-checkbox"
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
    <div class="flex row items-center justify-center">
      <q-btn
        :label="$t('actions.home.importProject')"
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
import {
  ref,
  watch,
} from 'vue';
import {
  notEmpty,
  isUrl,
  isUnique,
} from 'src/composables/QuasarFieldRule';
import {
  getProjects,
  deleteProjectById,
  extractProjectName,
} from 'src/composables/Project';
import { importProject } from 'src/composables/Git';

const emit = defineEmits(['project:import']);

const { t } = useI18n();
const project = {};
const repository = ref();
const username = ref();
const token = ref();
const submitting = ref(false);
const projectNames = ref(Object.keys(getProjects()));
const isDuplicate = ref(false);
const overwrite = ref(false);
const isUniqueRuleEnabled = ref(true);

/**
 * Import project, manage toast and loader.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function onSubmit() {
  submitting.value = true;
  project.id = extractProjectName(repository.value);
  project.git = {
    repository: repository.value,
    username: username.value,
    token: token.value,
  };

  if (overwrite.value) {
    await deleteProjectById(project.id);
  }

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

watch(repository, (value) => {
  isDuplicate.value = projectNames.value.includes(extractProjectName(value));
});

watch(overwrite, (value) => {
  isUniqueRuleEnabled.value = !value;
});
</script>

<style lang="scss" scoped>
.import-project-form {
  min-width: 400px;
}
</style>
