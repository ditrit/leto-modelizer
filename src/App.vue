<template>
  <router-view />
</template>

<script setup>
import { initPlugins } from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import { onMounted } from 'vue';

onMounted(() => {
  initPlugins().then(() => {
    PluginEvent.InitEvent.next();
  });
});
</script>
