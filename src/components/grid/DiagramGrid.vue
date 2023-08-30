<template>
  <div
    v-if="diagrams?.length === 0"
    class="row text-center text-h6 text-grey empty-grid diagram-grid"
    data-cy="diagram-grid-empty"
  >
    {{ $t('page.models.empty') }}
  </div>
  <div
    v-else
    class="row items-start q-gutter-md"
    data-cy="diagram-grid"
  >
    <model-card
      v-for="diagram in diagrams"
      :key="`${diagram.plugin}/${diagram.name}`"
      :model="diagram"
      @click="$emit('click:diagram', diagram)"
    />
  </div>
</template>

<script setup>
import ModelCard from 'src/components/card/ModelCard.vue';

defineEmits(['click:diagram']);
defineProps({
  diagrams: {
    type: Object,
    required: true,
  },
});
</script>
