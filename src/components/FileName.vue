<template>
    <span
      :class="[isActive ? 'text-bold' : '', fileStatus]"
      :data-cy="`file-tab-label-${label}`"
    >
      {{label}}
    </span>
</template>

<script setup>
import FileEvent from 'src/composables/events/FileEvent';
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import { getStatus } from 'src/composables/Project';

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

const route = useRoute();
const fileStatus = ref(props.status);
let updateFileSubscription;

/**
 * Update fileStatus when file content is updated.
 * @param {String} filePath - Path (id) of the updated file.
 */
async function onUpdateFile(filePath) {
  if (filePath === props.path) {
    const filePathStatus = await getStatus(
      route.params.projectName,
      [filePath],
      (f) => f === filePath,
    );

    fileStatus.value = filePathStatus[0].status;
  }
}

watch(() => props.status, () => {
  fileStatus.value = props.status;
});

onMounted(() => {
  updateFileSubscription = FileEvent.UpdateFileEvent.subscribe(onUpdateFile);
});

onUnmounted(() => {
  updateFileSubscription.unsubscribe();
});

</script>
