<template>
  <q-header
    class="bg-primary text-white shadow-1 row justify-between items-center q-px-lg"
    data-cy="navigation-bar"
  >
    <div class="application-name">
      <q-img
        class="logo"
        left
      />
      <label
        class="vertical-middle cursor-pointer text-white text-subtitle1"
      >
        {{ $t('application.name') }}
      </label>
    </div>
    <modelizer-settings-menu />
  </q-header>
</template>

<script setup>
import ModelizerSettingsMenu from 'components/menu/ModelizerSettingsMenu.vue';
</script>
