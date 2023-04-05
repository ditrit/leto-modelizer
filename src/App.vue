<template>
  <router-view />
</template>

<script setup>
import { getPlugins, initPlugins } from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';
import { onMounted } from 'vue';

const intervalTime = 5 * 60 * 1000; // 5 min

onMounted(() => {
  initPlugins().then(() => {
    PluginEvent.InitEvent.next();
  });

  setInterval(() => {
    getPlugins.forEach((plugin) => {
      plugin.data.deleteAllEventLogsBefore(Date.now() - intervalTime);
    });
  }, intervalTime);
});
</script>
