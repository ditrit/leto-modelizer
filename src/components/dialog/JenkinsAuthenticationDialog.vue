<template>
  <default-dialog
    dialog-key="JenkinsAuthentication"
    data-cy="jenkins-authentication-dialog"
  >
    <template v-slot:title>
      <q-icon
        color="primary"
        name="fa-brands fa-jenkins"
      />
      {{ $t('page.modelizer.settings.jenkinsAuthentication.title') }}
    </template>
    <template v-slot:default>
      <jenkins-authentication-form
        :project-name="projectName"
        @project-jenkins:save="DialogEvent.next({ type: 'close', key: 'JenkinsAuthentication' })"/>
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog';
import JenkinsAuthenticationForm from 'components/form/JenkinsAuthenticationForm';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
</script>
