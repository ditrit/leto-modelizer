<template>
  <default-dialog
    dialog-key="GitAuthentication"
    data-cy="git-authentication-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-brands fa-git-alt"
      />
      {{ $t('page.modelizer.settings.gitAuthentication.title') }}
    </template>
    <template #default>
      <git-authentication-form
        :project-name="projectName"
        @project-git:save="DialogEvent.next({ type: 'close', key: 'GitAuthentication' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog';
import GitAuthenticationForm from 'components/form/GitAuthenticationForm';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
</script>
