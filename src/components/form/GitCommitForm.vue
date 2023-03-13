<template>
  <q-form
    ref="form"
    @submit="onSubmit"
    data-cy="git-commit-form"
    class="q-gutter-md git-commit-form"
  >
    <q-input
      filled
      v-model="message"
      :label="$t('page.modelizer.git.commit.message')"
      lazy-rules
      data-cy="message-input"
      :rules="[(v) => notEmpty(t, v)]"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.git.commit')"
        :loading="submitting"
        type="submit"
        data-cy="submit-button"
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
import { notEmpty } from 'src/composables/QuasarFieldRule';
import { gitCommit } from 'src/composables/Project';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';

const emit = defineEmits(['git-commit:save']);

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const form = ref(null);
const message = ref(null);
const submitting = ref(false);

/**
 * Save commit and manage toast and loader.
 */
function onSubmit() {
  submitting.value = true;
  return gitCommit(props.projectName, message.value)
    .then(() => {
      emit('git-commit:save');
      Notify.create({
        type: 'positive',
        message: t('actions.git.committed'),
        html: true,
      });
    })
    .catch(({ name }) => {
      Notify.create({
        type: 'negative',
        message: t(`errors.git.${name}`),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
    });
}
</script>
