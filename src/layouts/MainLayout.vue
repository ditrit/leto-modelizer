<template>
  <q-layout view="HHh Lpr Fff">
    <default-navigation-bar v-if="isHomePage" />
    <home-drawer v-if="isHomePage" />
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer
      v-if="showFooter"
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
import HomeDrawer from 'src/components/drawer/HomeDrawer';
import {
  ref,
  computed,
} from 'vue';
import { useRoute } from 'vue-router';
import DefaultNavigationBar from 'components/DefaultNavigationBar.vue';

const route = useRoute();
const version = ref(process.env.VERSION);
const viewType = computed(() => route.params.viewType);
const showFooter = computed(() => (viewType.value !== 'text' && viewType.value !== 'draw'));
const isHomePage = computed(() => route.path === '/');
</script>
