<template>
  <default-drawer
    :has-close-btn="false"
    :bordered="false"
    class="column no-wrap bg-grey-2"
    data-cy="home-drawer"
  >
    <template #content>
      <q-list>
        <q-item
          v-ripple
          clickable
          active
          active-class="text-accent"
        >
          <q-item-section avatar>
            <q-icon name="fa-solid fa-clock-rotate-left" />
          </q-item-section>
          <q-item-section class="text-bold">
            {{ $t('page.home.drawer.projects.recent') }}
          </q-item-section>
        </q-item>
        <short-projects-item />
        <q-separator
          color="primary"
          class="q-ma-md"
        />
      </q-list>
    </template>
  </default-drawer>
</template>

<script setup>
import DefaultDrawer from 'src/components/drawer/DefaultDrawer';
import ShortProjectsItem from 'src/components/item/ShortProjectsItem';
</script>
