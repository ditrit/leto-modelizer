<template>
  <q-menu ref="menu" no-refocus>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ definition.displayName || definition.type }}
        </div>
        <div
          v-if="isAttribute"
          class="text-subtitle2"
        >
          <code>{{ definition.name }}</code>: {{ definition.type }}
        </div>
        <div class="q-mt-md" v-html="$sanitize(definition.description)"></div>
        <div class="q-mt-lg text-right">
          <a
            :href="$sanitize(definition.url)"
            target="_blank"
          >
            {{ $t('plugin.component.attribute.url') }}
          </a>
        </div>
        <q-btn
          flat
          rounded
          color="primary"
          size="xs"
          icon="fa-solid fa-close"
          class="absolute-top-right q-ma-xs q-pa-xs"
          @click="menu.hide"
        />
      </q-card-section>
    </q-card>
  </q-menu>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  definition: {
    type: Object,
    required: true,
  },
  isAttribute: {
    type: Boolean,
    default: false,
  },
});
const menu = ref(null);
</script>
