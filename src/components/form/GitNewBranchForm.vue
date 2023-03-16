<template>
  <q-form
    ref="form"
    @submit="onSubmit"
    class="q-gutter-md git-new-branch-form"
    data-cy="git-new-branch-form"
  >
    <q-input
      filled
      v-model="newBranch"
      :label="$t('page.modelizer.git.newBranch.branch')"
      lazy-rules
      :rules="[(v) => notEmpty(t, v), (v) => isUniqueBranchName(t, branches, v)]"
      data-cy="branch-name-input"
    />
    <q-checkbox
      v-model="checkout"
      :label="$t('page.modelizer.git.newBranch.checkout')"
      data-cy="checkout-checkbox"
    />
    <div class="flex row items-center justify-center">
      <q-btn
        icon="fa-solid fa-save"
        :label="$t('actions.default.create')"
        type="submit"
        :loading="submitting"
        color="positive"
        data-cy="submit-button"
      >
        <template v-slot:loading>
          <q-spinner-dots/>
        </template>
      </q-btn>
    </div>
  </q-form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { notEmpty, isUniqueBranchName } from 'src/composables/QuasarFieldRule';
import {
  getBranches,
  createBranchFrom,
  gitCheckout,
} from 'src/composables/Project';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';
import GitEvent from 'src/composables/events/GitEvent';

const emit = defineEmits(['git-branch:create']);

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
const newBranch = ref(null);
const checkout = ref(true);
const submitting = ref(false);
const branches = ref([]);

/**
 * Create new branch and manage toast and loader.
 */
function onSubmit() {
  submitting.value = true;
  return createBranchFrom(props.projectName, newBranch.value, props.branchName, checkout.value)
    .then(async () => {
      emit('git-branch:create');
      GitEvent.NewBranchEvent.next();

      if (checkout.value) {
        await gitCheckout(props.projectName, newBranch.value);
        GitEvent.CheckoutEvent.next(newBranch.value);
      }

      Notify.create({
        type: 'positive',
        message: t('actions.git.branch.create'),
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

onMounted(() => {
  getBranches(props.projectName).then((array) => {
    branches.value = array;
  });
});
</script>
