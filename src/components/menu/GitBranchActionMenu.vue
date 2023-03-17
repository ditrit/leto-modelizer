<template>
  <q-menu
    ref="menu"
    data-cy="git-branch-action-menu"
  >
    <q-list>
      <q-item
        v-if="!isCurrentBranch"
        clickable
        @click="onCheckout"
        :data-cy="`checkout_${branchName}`"
      >
        <q-item-section>{{ $t('actions.git.checkout') }}</q-item-section>
      </q-item>
      <q-linear-progress
        v-if="!isCurrentBranch && loading.checkout"
        color="primary"
        indeterminate
        :data-cy="`checkout-loader_${branchName}`"
      />
      <q-item
        clickable
        @click="openDialog('GitNewBranch')"
        :data-cy="`new-branch_${branchName}`"
      >
        <q-item-section>
          {{ $t('actions.git.newBranchFrom', { branch: branchName }) }}
        </q-item-section>
      </q-item>

      <q-separator v-if="onLocal"/>

      <q-item
        v-if="onLocal && onRemote"
        clickable
        @click="openDialog('GitUpdate')"
        :data-cy="`update_${branchName}`"
      >
        <q-item-section>
          {{ $t('actions.git.update') }}
        </q-item-section>
      </q-item>

      <q-item
        v-if="onLocal"
        clickable
        @click="openDialog('GitPush')"
        :data-cy="`push_${branchName}`"
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
 * Execute checkout action, manage toast and loader.
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
 * Send event to open the dialog corresponding to the key and emit event.
 * @param {String} key - Event key.
 */
function openDialog(key) {
  DialogEvent.next({ type: 'open', key, branch: props.branchName });
  emit('action:done');
}
</script>
