<template>
  <q-dialog v-model="show">
    <q-card class="q-pa-md">
      <q-btn
        icon="fa-solid fa-xmark"
        class="close-dialog-button"
        flat round dense v-close-popup
        data-cy="close-dialog-button"
      />
      <q-card-section class="text-h6 q-mb-xl">
        <slot name="title"></slot>
      </q-card-section>
      <slot></slot>
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

function onDialogEvent(event) {
  if (event.key === props.dialogKey) {
    if (event.type === 'open') {
      show.value = true;
    } else if (event.type === 'close') {
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
