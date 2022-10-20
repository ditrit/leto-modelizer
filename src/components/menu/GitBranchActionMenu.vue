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
        @click="onNewBranch"
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
        @click="onUpdate"
      >
        <q-item-section>
          {{ $t('actions.git.update') }}
        </q-item-section>
      </q-item>

      <q-item
        v-if="onLocal"
        :data-cy="`git-menu-branch-push-${branchName}`"
        clickable
        @click="onPush"
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
import { checkout } from 'src/composables/Project';
import { useRoute } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';

const route = useRoute();
const menu = ref(null);
const loading = ref({
  checkout: false,
});
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
  return checkout(route.params.projectName, props.branchName)
    .finally(() => {
      loading.value.checkout = false;
    });
}

/**
 * Send event to open the GitNewBranchDialog and close the menu.
 */
function onNewBranch() {
  DialogEvent.next({ type: 'open', key: 'GitNewBranch', branch: props.branchName });
  menu.value.hide();
}

/**
 * Send event to open the GitUpdateDialog and close the menu.
 */
function onUpdate() {
  DialogEvent.next({ type: 'open', key: 'GitUpdate', branch: props.branchName });
  menu.value.hide();
}

/**
 * Send event to open the GitPushDialog and close the menu.
 */
function onPush() {
  DialogEvent.next({
    type: 'open',
    key: 'GitPush',
    branch: props.branchName,
  });
  menu.value.hide();
}
</script>
