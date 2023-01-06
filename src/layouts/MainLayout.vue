<template>
  <!-- <q-layout view="lHh Lpr lFf"> -->
  <q-layout view="hHh LpR lfr">
    <!-- <q-page-container> -->
      <router-view />
    <!-- </q-page-container> -->
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>
