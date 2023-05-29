<template>
  <q-card
    class="template-grid bg-white"
  >
    <q-card-section>
      <div class="text-h6 text-secondary">
        <slot name="header" />
      </div>
    </q-card-section>
    <q-card-section
      class="q-ma-md bg-grey-1 q-pb-none template-card-container row items-center wrap"
    >
      <div
        v-for="template in templates"
        :key="template.key"
        class="template-card-item row q-mb-md justify-center items-center"
      >
        <template-card
          :template="template"
          class="template-card"
          @click="$emit('add:template', template)"
        />
      </div>
      <div
        v-if="templates.length === 0"
        class="row text-center text-subtitle2 text-grey q-mb-md"
      >
        {{ $t('page.home.template.empty') }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import TemplateCard from 'src/components/card/TemplateCard';

defineEmits(['add:template']);

defineProps({
  templates: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.template-card-container {
  overflow-y: auto;
  max-height: 275px;
  box-shadow: inset 0px 0px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
.template-card-item {
  flex-basis: calc(100% / 8);
  min-width: 125px;
}
.template-card {
  width: 100px;
  height: 100px;
}
</style>
