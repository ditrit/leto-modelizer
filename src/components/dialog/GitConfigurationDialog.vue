<template>
  <default-dialog dialog-key="GitProvider" data-cy="git-settings-dialog">
    <template v-slot:title>
      <q-icon color="primary" name="fa-brands fa-git-alt" />
      {{ $t('page.modelizer.settings.gitProvider.title') }}
    </template>
    <template v-slot:default>
      <git-settings-form
          :project-name="projectName"
          @project-git:save="DialogEvent.next({ type: 'close', key: 'GitProvider' })"/>
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog';
import GitSettingsForm from 'components/form/GitSettingsForm';

defineProps({
  projectName: String,
});
</script>
