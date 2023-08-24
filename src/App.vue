<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { setUserManager } from 'src/composables/UserAuthentication';

onMounted(() => {
  setUserManager(localStorage.getItem('provider'));
});
</script>
