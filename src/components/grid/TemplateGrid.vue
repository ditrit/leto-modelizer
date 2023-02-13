<template>
  <div class="project-grid">
    <div>
      <div class="row items-center">
        <slot name="header"></slot>
      </div>
      <div class="row">
        <TemplateCard
          v-for="template in templates"
          :key="template.key"
          :template="template"
          class="q-ma-sm"
          @click="$emit('add:template', template)"
        />
      </div>
      <div
        v-if="templates.length === 0"
        class="row text-center text-h6 text-grey empty-grid"
      >
        {{ $t('page.home.template.empty') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import TemplateCard from 'src/components/card/TemplateCard';

defineProps({
  templates: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.empty-grid {
  margin-top: 5vh;
}
</style>
