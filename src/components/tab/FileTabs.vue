<template>
  <div class="col" data-cy="file-tabs">
    <q-tabs
      v-model="activeFileId"
      dense
      class="text-grey bg-grey-2 tab-container"
      active-color="primary"
      indicator-color="transparent"
      align="left"
      data-cy="file-tabs-container"
    >
      <file-tab-header
        v-for="file in files"
        :key="file.id"
        :file="file"
        :isActive="file.id === activeFileId"
        @update:close-file="$event => emit('update:close-file', $event)"
      />
    </q-tabs>
    <q-tab-panels v-model="activeFileId">
      <q-tab-panel
        v-for="file in files"
        :key="file.id"
        :name="file.id"
        :data-cy="`file-tab-content-${file.label}`"
      >
        <slot :file="file"></slot>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import FileTabHeader from 'src/components/tab/FileTabHeader.vue';

const emit = defineEmits(['update:modelValue', 'update:close-file']);
import FileEvent from 'src/composables/events/FileEvent';

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
});

const activeFileId = ref(props.modelValue.id);
let selectFileNodeSubscription;

watch(activeFileId, () => {
  if (activeFileId.value !== props.modelValue.id) {
    emit('update:modelValue', { isSelected: true, id: activeFileId.value });
  }
});

watch(() => props.modelValue, (newModelValue) => {
  activeFileId.value = newModelValue.id;
onMounted(() => {
  selectFileNodeSubscription = FileEvent.SelectFileNodeEvent.subscribe(onSelectFileNode);
});

onUnmounted(() => {
  selectFileNodeSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
  .tab-container {
    box-shadow: inset 0 -1px 0 #eee
  }
</style>
