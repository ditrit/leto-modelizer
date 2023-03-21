<template>
  <default-dialog
    dialog-key="GitAddRemote"
    data-cy="git-add-remote-dialog"
  >
    <template #title>
      <q-icon
        color="primary"
        name="fa-solid fa-book-bookmark"
      />
      {{ $t('page.modelizer.settings.gitAddRemote.title') }}
    </template>
    <template #default>
      <git-add-remote-form
        :project-name="projectName"
        @project-git:save="DialogEvent.next({ type: 'close', key: 'GitAddRemote' })"
      />
    </template>
  </default-dialog>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';
import DefaultDialog from 'components/dialog/DefaultDialog';
import GitAddRemoteForm from 'components/form/GitAddRemoteForm';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});
</script>
