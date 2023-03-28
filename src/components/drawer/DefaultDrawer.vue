<template>
  <q-drawer
    v-model="componentsDrawer"
    :mini="!componentsDrawer || drawerMiniState"
    show-if-above
    bordered
    side="left"
    @click.capture="openDrawer"
  >
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label
            overline
            header
          >
            <slot name="drawerName" />
          </q-item-label>
        </q-item-section>
        <q-item-section
          v-if="hasCloseBtn"
          avatar
        >
          <q-btn
            round
            flat
            :icon="`fa-solid fa-${ drawerMiniState ? 'bars' : 'minus' }`"
            @click="drawerMiniState = true"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <slot name="content" />
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  hasCloseBtn: {
    type: Boolean,
    default: true,
  },
});

const componentsDrawer = ref(true);
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
