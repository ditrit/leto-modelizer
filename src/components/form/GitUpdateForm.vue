<template>
  <q-form
    ref="form"
    class="q-gutter-md git-update-form"
    data-cy="git-update-form"
    @submit="onSubmit"
  >
    <div v-html="$t('page.modelizer.git.update.description', { branch: branchName })" />
    <q-checkbox
      v-model="fastForward"
      data-cy="fast-forward-checkbox"
    >
      <span v-html="$t('page.modelizer.git.update.fastForward')" />
    </q-checkbox>
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-cloud-arrow-down"
        :label="$t('actions.default.update')"
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
import { ref } from 'vue';
import { getProjectById } from 'src/composables/Project';
import { gitUpdate } from 'src/composables/Git';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import GitEvent from 'src/composables/events/GitEvent';

const emit = defineEmits(['git-branch:update']);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const form = ref(null);
const fastForward = ref(true);
const submitting = ref(false);

/**
 * Update branch and manage toast and loader.
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function onSubmit() {
  submitting.value = true;
  return gitUpdate(
    getProjectById(props.projectName),
    props.branchName,
    fastForward.value,
  ).then(() => {
    emit('git-branch:update');
    GitEvent.PullEvent.next();
    Notify.create({
      type: 'positive',
      message: t('actions.git.branch.update'),
      html: true,
    });
  }).catch(({ name }) => {
    Notify.create({
      type: 'negative',
      message: t(`errors.git.${name}`),
      html: true,
    });
  }).finally(() => {
    submitting.value = false;
  });
}
</script>
