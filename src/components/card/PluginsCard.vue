<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        {{ $t('page.home.plugins.title') }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-chip
        v-for="plugin in plugins"
        :key="plugin"
        outline
        square
        color="accent"
        text-color="primary"
      >
        {{ plugin }}
      </q-chip>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  plugins: {
    type: Array,
    required: true,
  },
});
</script>
