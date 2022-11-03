<template>
  <div class="col" data-cy="file-tabs">
    <q-tabs
      v-model="activeFileId"
      dense
      class="text-grey bg-grey-2 tab-container"
      active-color="primary"
      indicator-color="transparent"
      align="left"
    >
      <q-tab
        v-for="file in files"
        :key="file.id"
        :name="file.id"
        no-caps
        :ripple="false"
        :class="`tab-item
          ${activeFileId === file.id ? 'tab-item--active' : 'tab-item--inactive'}`"
        data-cy="file-tabs-container"
      >
        <div
          class="row items-center"
          :data-cy="`${activeFileId === file.id ? 'active' : 'inactive'}-tab`"
        >
          <file-name
            :path="file.id"
            :isActive="activeFileId === file.id"
            :label="file.label"
            :status="file.information?.status"
          />
          <q-btn
            flat
            round
            size="xs"
            :color="activeFileId === file.id ? 'primary' : 'gray'"
            icon="fa-solid fa-xmark"
            class="q-ml-sm"
            @click.stop="emit('update:close-file', file.id)"
            data-cy="close-file-tab"
          />
        </div>
      </q-tab>
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
import { ref, watch } from 'vue';
import FileName from 'src/components/FileName.vue';

const emit = defineEmits(['update:modelValue', 'update:close-file']);

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

watch(activeFileId, () => {
  if (activeFileId.value !== props.modelValue.id) {
    emit('update:modelValue', { isSelected: true, id: activeFileId.value });
  }
});

watch(() => props.modelValue, (newModelValue) => {
  activeFileId.value = newModelValue.id;
});

</script>

<style lang="scss" scoped>
  .tab-container {
    box-shadow: inset 0 -1px 0 #eee
  }
  .tab-item {
    border-right: solid 1px #eee
  }
  .tab-item--active {
    background: white;
    box-shadow: inset 0 -1px 0 white;
  }
  .tab-item--inactive {
    background: #eee
  }
</style>
