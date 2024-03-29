<template>
  <q-form
    ref="form"
    class="q-gutter-md git-push-form"
    data-cy="git-push-form"
    @submit="onSubmit"
  >
    <div v-html="$t('page.modelizer.git.push.description', { branch: branchName })" />
    <q-checkbox
      v-model="force"
      data-cy="force-checkbox"
    >
      <span v-html="$t('page.modelizer.git.push.force', { branch: branchName })" />
    </q-checkbox>
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-cloud-arrow-up"
        :label="$t('actions.git.push')"
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
import { gitPush } from 'src/composables/Git';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

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
 * @returns {Promise} Promise with nothing on success otherwise an error.
 */
async function onSubmit() {
  submitting.value = true;
  return gitPush(
    getProjectById(props.projectName),
    props.branchName,
    force.value,
  ).then(() => {
    emit('git-branch:push');
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
