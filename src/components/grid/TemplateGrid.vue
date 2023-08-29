<template>
  <q-card
    class="template-grid bg-white"
  >
    <q-card-section class="row justify-between">
      <div class="text-h6 text-secondary">
        <slot name="header" />
      </div>
      <q-input
        v-model="searchTemplateText"
        outlined
        dense
        clearable
        class="search-bar"
        :label="$t('page.home.template.search')"
      >
        <template #prepend>
          <q-icon
            name="fa-solid fa-magnifying-glass"
            size="xs"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section
      class="q-ma-md bg-grey-1 q-pb-none template-card-container row items-center wrap"
    >
      <div
        v-for="template in filteredTemplates"
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
        v-if="filteredTemplates.length === 0"
        class="row text-center text-subtitle2 text-grey q-mb-md"
      >
        {{ $t('page.home.template.empty') }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { searchText } from 'src/composables/Filter';
import TemplateCard from 'src/components/card/TemplateCard.vue';

defineEmits(['add:template']);

const props = defineProps({
  templates: {
    type: Array,
    required: true,
  },
});

const searchTemplateText = ref('');
const filteredTemplates = computed(() => props.templates
  .filter(({ type }) => searchText(type, searchTemplateText.value))
  .slice(0, 32));
</script>

<style scoped>
.template-card-container {
  overflow-y: auto;
  max-height: 350px;
  box-shadow: inset 0px 0px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
.template-card-item {
  flex-basis: calc(100% / 8);
  min-width: 125px;
}
.search-bar {
  min-width: 300px;
}
</style>
