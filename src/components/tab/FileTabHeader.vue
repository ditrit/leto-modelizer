<template>
  <q-tab
    :name="file.id"
    no-caps
    :ripple="false"
    :class="['tab-item', { 'active': isActive }]"
    :data-cy="`${isActive? 'active' : 'inactive'}-tab`"
  >
    <div class="row items-center">
      <file-name
        :path="file.id"
        :is-active="isActive"
        :label="file.label"
        :status="file.information?.status"
      />
      <q-btn
        flat
        round
        size="xs"
        :color="isActive? 'primary' : 'gray'"
        icon="fa-solid fa-xmark"
        class="q-ml-sm"
        data-cy="close-button"
        @click.stop="emit('update:close-file', file.id)"
      />
    </div>
  </q-tab>
</template>

<script setup>
import FileName from 'src/components/FileName.vue';

const emit = defineEmits(['update:close-file']);

defineProps({
  file: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

</script>

<style lang="scss" scoped>
  .tab-item {
    border-right: solid 1px #eee;
    background: #eee;

    &.active {
      background: white;
      box-shadow: inset 0 -1px 0 white;
    }
  }
</style>
