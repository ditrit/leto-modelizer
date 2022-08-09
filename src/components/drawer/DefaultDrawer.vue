<template>
  <q-drawer
    v-model="componentsDrawer"
    :mini="!componentsDrawer || drawerMiniState"
    @click.capture="openDrawer"
    show-if-above
    bordered
    side="left"
  >
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label overline header>
            <slot name="drawerName"></slot>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            round
            flat
            @click="drawerMiniState = true"
            :icon="`fa-solid fa-${ drawerMiniState ? 'bars' : 'minus' }`"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <slot name="content"></slot>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';

const componentsDrawer = ref(false);
const drawerMiniState = ref(false);
/**
 * Opens the drawer.
 */
function openDrawer(event) {
  if (drawerMiniState.value) {
    drawerMiniState.value = false;
    event.stopPropagation();
  }
}
</script>
