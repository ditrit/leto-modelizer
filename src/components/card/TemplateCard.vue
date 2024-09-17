<template>
  <q-card
    tabindex="0"
    class="cursor-pointer template-card transparent"
    :data-cy="`template-card_${template.key}`"
    flat
  >
    <q-card-section class="q-pa-none">
      <q-img
        class="rounded-borders template-img bg-white"
        :src="`/template-library/templates/${template.key}/icon.svg`"
        fit="fill"
      />
    </q-card-section>
    <q-card-section
      class="q-px-none q-py-sm text-caption ellipsis-2-lines"
      data-cy="title-container"
    >
      {{ template.name || template.type }}
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  template: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.template-card {
  width: 100px;
  height: 150px;
  overflow: hidden;
}
.template-img {
  width: 100px;
  height: 100px;
  border: 1px solid $grey-3;
}
</style>
