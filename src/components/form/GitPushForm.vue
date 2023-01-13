<template>
  <q-form
    ref="form"
    @submit="onSubmit"
    data-cy="git-push-form"
    class="q-gutter-md git-push-form"
  >
    <div v-html="$t('page.modelizer.git.push.description', { branch: branchName })"></div>
    <q-checkbox
      v-model="force"
      data-cy="git-force-checkbox"
    >
      <span v-html="$t('page.modelizer.git.push.force', { branch: branchName })"></span>
    </q-checkbox>
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-cloud-arrow-up"
        :label="$t('actions.git.push')"
        type="submit"
        :loading="submitting"
        data-cy="git-form-submit"
        color="positive"
      >
        <template v-slot:loading>
          <q-spinner-dots/>
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { getProjectById, gitPush } from 'src/composables/Project';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import GitEvent from 'src/composables/events/GitEvent';

const emit = defineEmits(['git-branch:push']);

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
const force = ref(false);
const submitting = ref(false);

/**
 * Push branch and manage toast and loader.
 */
async function onSubmit() {
  submitting.value = true;
  return gitPush(
    getProjectById(props.projectName),
    props.branchName,
    force.value,
  ).then(() => {
    emit('git-branch:push');
    GitEvent.PushEvent.next();
    Notify.create({
      type: 'positive',
      message: t('actions.git.branch.push'),
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
