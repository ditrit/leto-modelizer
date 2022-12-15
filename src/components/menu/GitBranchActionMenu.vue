<template>
  <q-menu ref="menu">
    <q-list>
      <q-item
        v-if="!isCurrentBranch"
        :data-cy="`git-menu-branch-checkout-${branchName}`"
        clickable
        @click="onCheckout"
      >
        <q-item-section>{{ $t('actions.git.checkout') }}</q-item-section>
      </q-item>
      <q-linear-progress
        v-if="!isCurrentBranch && loading.checkout"
        :data-cy="`git-menu-branch-checkout-loader-${branchName}`"
        color="primary"
        indeterminate
      />
      <q-item
        :data-cy="`git-menu-branch-new-branch-${branchName}`"
        clickable
        @click="openDialog('GitNewBranch')"
      >
        <q-item-section>
          {{ $t('actions.git.newBranchFrom', { branch: branchName }) }}
        </q-item-section>
      </q-item>

      <q-separator v-if="onLocal"/>

      <q-item
        v-if="onLocal && onRemote"
        :data-cy="`git-menu-branch-update-${branchName}`"
        clickable
        @click="openDialog('GitUpdate')"
      >
        <q-item-section>
          {{ $t('actions.git.update') }}
        </q-item-section>
      </q-item>

      <q-item
        v-if="onLocal"
        :data-cy="`git-menu-branch-push-${branchName}`"
        clickable
        @click="openDialog('GitPush')"
      >
        <q-item-section>
          {{ $t('actions.git.push') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import { ref } from 'vue';
import { gitCheckout } from 'src/composables/Project';
import { useRoute } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import GitEvent from 'src/composables/events/GitEvent';
import { useI18n } from 'vue-i18n';
import { Notify } from 'quasar';

const emit = defineEmits(['action:done']);

const route = useRoute();
const menu = ref(null);
const loading = ref({
  checkout: false,
});
const { t } = useI18n();

const props = defineProps({
  branchName: {
    type: String,
    required: true,
  },
  isCurrentBranch: {
    type: Boolean,
    default: false,
  },
  onLocal: {
    type: Boolean,
    default: false,
  },
  onRemote: {
    type: Boolean,
    default: false,
  },
});

/**
 * Execute checkout action.
 * @return {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function onCheckout() {
  loading.value.checkout = true;
  return gitCheckout(route.params.projectName, props.branchName)
    .then(() => {
      GitEvent.CheckoutEvent.next(props.branchName);
      emit('action:done');
    })
    .catch(({ name }) => {
      Notify.create({
        type: 'negative',
        message: t(`errors.git.${name}`),
        html: true,
      });
    })
    .finally(() => {
      loading.value.checkout = false;
    });
}

/**
 * Send event to open the dialog corresponding to the key, emit event and close the menu.
 */
function openDialog(key) {
  DialogEvent.next({ type: 'open', key, branch: props.branchName });
  emit('action:done');
}
</script>
