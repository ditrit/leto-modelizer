<template>
  <span
    :class="[isActive ? 'text-bold' : '', fileStatus]"
    :data-cy="`${isFolder ? 'folder': 'file'}_${path}`"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { toRef } from 'vue';

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  isFolder: {
    type: Boolean,
    default: false,
  },
});

const fileStatus = toRef(props, 'status');
</script>
