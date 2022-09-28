<template>
  <q-card flat bordered class="component-definition-card">
    <q-item clickable>
      <q-item-section avatar v-if="definition.icon">
        <q-icon
          color="primary"
          :name="`img:/plugins/${pluginName}/icons/${definition.icon}.svg`"
        >
        </q-icon>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ definition.type }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
defineProps({
  definition: {
    type: Object,
    required: true,
  },
  pluginName: {
    type: String,
    required: true,
  },
});
</script>
