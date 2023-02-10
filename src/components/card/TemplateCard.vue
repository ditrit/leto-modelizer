<template>
  <q-card
    v-ripple
    tabindex="0"
    class="cursor-pointer template-card"
  >
    <q-img
      :src="`/template-library/templates/${template.key}/icon.svg`"
      height="100%"
    >
      <div
        class="absolute-bottom text-subtitle2 text-center"
        data-cy="template-card-title"
      >
        {{ template.type }}
      </div>
    </q-img>
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

<style scoped>
.template-card {
  width: 150px;
  height: 150px;
}
</style>
