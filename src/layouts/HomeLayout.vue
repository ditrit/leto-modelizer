<template>
  <q-layout view="HHh Lpr Fff">
    <default-navigation-bar />
    <home-drawer />
    <q-page-container>
      <home-page />
    </q-page-container>
    <q-footer
      class="bg-primary col"
    >
      <q-toolbar class="row justify-center footer">
        <a
          :href="$sanitize(`https://github.com/ditrit/leto-modelizer/releases/tag/${version}`)"
          class="text-white q-ml-md"
          target="_blank"
        >
          {{ $t('footer.version', { version }) }}
        </a>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import DefaultNavigationBar from 'components/DefaultNavigationBar.vue';
import HomeDrawer from 'src/components/drawer/HomeDrawer.vue';
import HomePage from 'src/pages/HomePage.vue';
import {
  ref,
} from 'vue';

const version = ref(process.env.VERSION);
</script>
