<template>
  <q-item class="text-weight-bold text-grey-7">
    <q-item-section>
      {{ title }}
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
