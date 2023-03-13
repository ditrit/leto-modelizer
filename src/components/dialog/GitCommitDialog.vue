<template>
  <default-dialog
    dialog-key="GitCommit"
    data-cy="git-commit-dialog"
  >
    <template v-slot:title>
      <q-icon color="primary" name="fa-brands fa-git-alt" />
      {{ $t('page.modelizer.git.commit.title') }}
    </template>
    <template v-slot:default>
      <template v-if="loading">
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
      <template v-else>
        <q-list style="min-width: 500px" dense>
          <q-item
            v-if="stagedFiles.length === 0"
            data-cy="empty-item"
          >
            <q-item-section>
              {{ $t('page.modelizer.git.status.nothing') }}
            </q-item-section>
          </q-item>
          <template v-else>
            <q-item
              class="text-weight-bold text-grey-7"
              data-cy="staged-item-title"
            >
              <q-item-section>
                {{ $t('page.modelizer.git.status.staged') }}
              </q-item-section>
            </q-item>
            <q-item
              v-for="file in stagedFiles"
              :key="`staged_${file.path}`"
              data-cy="staged-item-file"
            >
              <q-item-section class="file-status-staged q-pl-md">
                {{file.path}}
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <git-commit-form
                  :project-name="projectName"
                  @git-commit:save="onSave"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </template>
    </template>
  </default-dialog>
</template>

<script setup>
import DefaultDialog from 'components/dialog/DefaultDialog';
import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { getStatus } from 'src/composables/Project';
import GitCommitForm from 'components/form/GitCommitForm';
import GitEvent from 'src/composables/events/GitEvent';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const stagedFiles = ref([]);
let dialogEventSubscription;

/**
 * Set files status on valid event.
 * @param {String} key - Event key.
 */
function setFilesStatus({ key }) {
  if (key === 'GitCommit') {
    loading.value = true;
    getStatus(props.projectName).then((files) => {
      stagedFiles.value = files.filter((f) => f.isStaged);
    }).finally(() => {
      loading.value = false;
    });
  }
}

/**
 * Send Commit event with staged files and close GitCommit dialog.
 */
function onSave() {
  GitEvent.CommitEvent.next(stagedFiles.value);
  DialogEvent.next({ type: 'close', key: 'GitCommit' });
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setFilesStatus);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
