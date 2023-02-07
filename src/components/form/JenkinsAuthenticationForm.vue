<template>
  <q-form
    @submit="onSubmit"
    data-cy="jenkins-authentication-form"
    class="q-gutter-md jenkins-authentication-form"
  >
    <q-input
      filled
      v-model="url"
      :label="$t('page.modelizer.settings.jenkinsAuthentication.url')"
      data-cy="jenkins-url-input"
    />
    <q-input
      filled
      v-model="username"
      :label="$t('page.modelizer.settings.jenkinsAuthentication.username')"
      data-cy="jenkins-username-input"
    />
    <q-input
      filled
      v-model="token"
      type="password"
      :label="$t('page.modelizer.settings.jenkinsAuthentication.token')"
      data-cy="jenkins-token-input"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.save')"
        type="submit"
        :loading="submitting"
        data-cy="jenkins-form-submit"
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
  getProjectById,
  saveProject,
} from 'src/composables/Project';
import JenkinsEvent from 'src/composables/events/JenkinsEvent';

const emit = defineEmits(['project-jenkins:save']);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const project = getProjectById(props.projectName);
const url = ref(project.jenkins?.url);
const username = ref(project.jenkins?.username);
const token = ref(project.jenkins?.token);
const submitting = ref(false);

/**
 * Save jenkins authentication in the project, emit events and send positive toast.
 */
function onSubmit() {
  submitting.value = true;
  project.jenkins = {
    url: url.value,
    username: username.value,
    token: token.value,
  };

  saveProject(project);
  emit('project-jenkins:save');
  JenkinsEvent.AuthenticationEvent.next();
  Notify.create({
    type: 'positive',
    message: t('actions.jenkins.authentication.update'),
    html: true,
  });

  submitting.value = false;
}
</script>

<style lang="scss" scoped>
.jenkins-authentication-form {
  min-width: 400px;
}
</style>
