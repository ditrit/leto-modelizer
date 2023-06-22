<template>
  <div class="fit row justify-center">
    <div class="col-md-8">
      <diagrams-card
        class="q-mt-lg"
        :project-name="projectName"
      />
    </div>
  </div>
</template>

<script setup>
import DiagramsCard from 'src/components/card/DiagramsCard.vue';

defineProps({
  projectName: {
    type: String,
    required: true,
  },
});

</script>
