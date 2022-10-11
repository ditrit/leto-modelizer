<template>
  <q-menu>
    <q-list>
      <q-item
        :data-cy="`git-menu-branch-checkout-${branchName}`"
        clickable
        v-if="!current"
        @click="onCheckout"
      >
        <q-item-section>{{ $t('actions.git.checkout') }}</q-item-section>
      </q-item>
      <q-linear-progress
        :data-cy="`git-menu-branch-checkout-loader-${branchName}`"
        color="primary"
        indeterminate
        v-if="loading.checkout"
      />
    </q-list>
  </q-menu>
</template>

<script setup>
import { ref } from 'vue';
import { checkout } from 'src/composables/Project';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref({
  checkout: false,
});
const props = defineProps({
  branchName: {
    type: String,
    required: true,
  },
  current: {
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
</script>
