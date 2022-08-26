<template>
  <q-btn round color="primary" icon="fa-solid fa-gear" data-cy="project-settings">
    <q-menu>
      <q-list>
        <q-item
            class="settings-item"
            clickable
            v-close-popup
            data-cy="git-settings-menu"
            v-for="menuItem in menuItems"
            :key="menuItem.key">
          <q-item-section avatar>
            <q-icon color="primary" :name="menuItem.icon" />
          </q-item-section>
          <q-item-section
            @click="onClick(menuItem.key)">
            {{$t(menuItem.title)}}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';

const menuItems = [{
  key: 'GitProvider',
  icon: 'fa-brands fa-git-alt',
  title: 'page.modelizer.settings.gitProvider.title',
}];

function onClick(key) {
  DialogEvent.next({ type: 'open', key });
}
</script>

<style lang="scss">
.settings-item {
  user-select: none;
}
</style>
