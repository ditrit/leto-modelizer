<template>
  <default-dialog dialog-key="GitStatus" data-cy="git-status-dialog">
    <template v-slot:title>
      <q-icon color="primary" name="fa-brands fa-git-alt" />
      {{ $t('page.modelizer.git.status.title') }}
    </template>

    <template v-slot:default>
      <template v-if="loading">
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>

      <template v-else>
        <q-list style="min-width: 500px" dense>
          <q-item v-if="noFiles">
            <q-item-section>
              {{ $t('page.modelizer.git.status.nothing') }}
            </q-item-section>
          </q-item>

          <template v-if="stagedFiles.length > 0">
            <q-item class="text-weight-bold text-grey-7">
              <q-item-section>
                {{ $t('page.modelizer.git.status.staged') }}
              </q-item-section>
            </q-item>
            <q-item
              :key="`staged_${file.path}`"
              v-for="file in stagedFiles"
            >
              <q-item-section class="file-status-staged q-pl-md">
                {{file.path}}
              </q-item-section>
            </q-item>
          </template>

          <template v-if="modifiedFiles.length > 0">
            <q-item class="text-weight-bold text-grey-7">
              <q-item-section>
                {{ $t('page.modelizer.git.status.modified') }}
              </q-item-section>
            </q-item>
            <q-item
              :key="`modified_${file.path}`"
              v-for="file in modifiedFiles"
            >
              <q-item-section class="file-status-modified q-pl-md">
                {{file.path}}
              </q-item-section>
            </q-item>
          </template>

          <template v-if="untrackedFiles.length > 0">
            <q-item class="text-weight-bold text-grey-7">
              <q-item-section>
                {{ $t('page.modelizer.git.status.untracked') }}
              </q-item-section>
            </q-item>
            <q-item
              :key="`untracked_${file.path}`"
              v-for="file in untrackedFiles"
            >
              <q-item-section class="file-status-untracked q-pl-md">
                {{file.path}}
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
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import { getStatus } from 'src/composables/Project';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const filesStatus = ref([]);
const stagedFiles = computed(() => filesStatus.value.filter((f) => f.isStaged));
const modifiedFiles = computed(() => filesStatus.value.filter((f) => f.hasUnstagedChanged));
const untrackedFiles = computed(() => filesStatus.value.filter((f) => f.isUntracked));
const noFiles = computed(() => stagedFiles.value.length === 0
    && modifiedFiles.value.length === 0
    && untrackedFiles.value.length === 0);
let dialogEventSubscription;

/**
 * Set files status on valid event.
 * @param {String} key - Event type.
 */
function setFilesStatus({ key }) {
  if (key === 'GitStatus') {
    loading.value = true;
    getStatus(props.projectName).then((files) => {
      filesStatus.value = files.filter((file) => !file.isUnmodified);
      loading.value = false;
    });
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(setFilesStatus);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
