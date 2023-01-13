<template>
    <span
      :class="[isActive ? 'text-bold' : '', fileStatus]"
      :data-cy="`file-label-${label}`"
    >
      {{ label }}
    </span>
</template>

<script setup>
import { ref, watch } from 'vue';

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
});

const fileStatus = ref(props.status);

watch(() => props.status, () => {
  fileStatus.value = props.status;
});

</script>
