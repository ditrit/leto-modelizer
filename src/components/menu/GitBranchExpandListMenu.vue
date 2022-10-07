<template>
  <q-item clickable class="text-weight-bold text-grey-7">
    <q-item-section avatar/>
    <q-item-section>
      {{ $t(open ? 'actions.default.show.less' : 'actions.default.show.more', { number }) }}
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    default: true,
  },
  number: Number,
});
</script>
