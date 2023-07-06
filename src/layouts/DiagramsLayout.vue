<template>
  <q-layout view="HHh Lpr Fff">
    <default-navigation-bar />
    <q-page-container>
      <diagrams-page />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import DefaultNavigationBar from 'src/components/DefaultNavigationBar.vue';
import DiagramsPage from 'src/pages/DiagramsPage.vue';
</script>
