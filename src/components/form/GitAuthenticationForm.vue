<template>
  <q-form
    class="q-gutter-md git-authentication-form"
    data-cy="git-authentication-form"
    @submit="onSubmit"
  >
    <q-input
      v-model="username"
      filled
      :label="$t('page.modelizer.settings.gitAuthentication.username')"
      data-cy="username-input"
    />
    <q-input
      v-model="token"
      filled
      :label="$t('page.modelizer.settings.gitAuthentication.token')"
      data-cy="token-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.save')"
        type="submit"
        :loading="submitting"
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
import { ref } from 'vue';
import {
  getProjectById,
  saveProject,
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
const username = ref(project.git?.username);
const token = ref(project.git?.token);
const submitting = ref(false);

/**
 * Save git authentication in the project, emit events and send positive toast.
 */
function onSubmit() {
  submitting.value = true;
  project.git = {
    repository: project.git?.repository,
    username: username.value,
    token: token.value,
  };

  saveProject(project);
  emit('project-git:save');
  GitEvent.AuthenticationEvent.next();
  Notify.create({
    type: 'positive',
    message: t('actions.git.authentication.update'),
    html: true,
  });

  submitting.value = false;
}
</script>

<style lang="scss" scoped>
.git-authentication-form {
  min-width: 400px;
}
</style>
