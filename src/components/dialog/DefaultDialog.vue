<template>
  <q-dialog v-model="show">
    <q-card class="q-pa-md">
      <q-btn
        v-close-popup
        icon="fa-solid fa-xmark"
        class="close-dialog-button"
        flat
        round
        dense
        data-cy="close-dialog-button"
      />
      <q-card-section class="text-h6 q-mb-xl">
        <slot name="title" />
      </q-card-section>
      <slot />
    </q-card>
  </q-dialog>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
} from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';

const props = defineProps({
  dialogKey: {
    type: String,
    required: true,
  },
});
const show = ref(false);
let dialogEventSubscription;

/**
 * Open or close dialog.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Dialog key.
 * @param {string} event.type - Action type, 'open' or 'close'.
 */
function onDialogEvent({ key, type }) {
  if (key === props.dialogKey) {
    if (type === 'open') {
      show.value = true;
    } else if (type === 'close') {
      show.value = false;
    }
  }
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(onDialogEvent);
});
onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>

<style scoped>
  .close-dialog-button {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 10;
  }
</style>
