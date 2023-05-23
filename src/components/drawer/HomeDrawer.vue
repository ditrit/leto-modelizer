<template>
  <default-drawer
    :has-close-btn="false"
    :bordered="false"
    class="column no-wrap"
    data-cy="home-drawer"
  >
    <template #content>
      <q-btn
        icon="fa-solid fa-clock-rotate-left"
        flat
        color="accent"
        no-caps
        :label="$t('page.home.project.recent')"
        align="left"
      />
    </template>
  </default-drawer>
</template>

<script setup>
import DefaultDrawer from 'src/components/drawer/DefaultDrawer';
</script>
