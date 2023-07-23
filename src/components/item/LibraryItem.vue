<template>
  <q-item
    v-ripple
    clickable
    :class="isSelected ? 'border-bottom selected' : ''"
    :data-cy="`component-definitions-item_${item.title}`"
  >
    <q-item-section avatar>
      <q-icon
        color="primary"
        :name="`fa-solid fa-chevron-${isSelected ? 'up' : 'down'}`"
      />
    </q-item-section>
    <q-item-section data-cy="title">
      {{
        $t('page.modelizer.drawer.components.title',
           { name: item.title, length: item.size })
      }}
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #eee;
}
</style>
