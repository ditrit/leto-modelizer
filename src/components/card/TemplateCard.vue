<template>
  <q-card
    tabindex="0"
    class="cursor-pointer template-card"
    :data-cy="`template-card_${template.name}`"
  >
    <q-card-section class="q-pa-none">
      <q-img
        v-if="templateIcon"
        class="rounded-borders template-img bg-white"
        :src="templateIcon"
        :alt="template.name"
        fit="contain"
      />
      <q-img
        v-if="template.type === 'DIAGRAM'"
        class="rounded-borders template-plugin-img bg-white"
        :src="`/plugins/${template.plugins[0]}/icons/logo.svg`"
        :alt="template.plugins[0]"
        :title="template.plugins[0]"
      />
    </q-card-section>
    <div
      class="text-caption ellipsis-2-lines text-center"
      data-cy="title-container"
    >
      {{ template.name }}
    </div>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getTemplateIcon } from 'src/services/ImageDownloadService';

const props = defineProps({
  template: {
    type: Object,
    required: true,
  },
});

const templateIcon = ref(null);

/**
 * Load template icon by its id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadTemplateIcon() {
  return getTemplateIcon({
    HAS_BACKEND: process.env.HAS_BACKEND,
    TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
  }, props.template)
    .then((icon) => {
      templateIcon.value = icon;
    })
    .catch(() => {
      templateIcon.value = null;
    });
}

onMounted(async () => {
  await loadTemplateIcon();
});
</script>

<style lang="scss" scoped>
.template-card {
  width: 100px;
  max-width: 100px;
  height: 100px;
  max-height: 100px;
  transition: filter 0.3s ease;
}
.template-card:hover {
  filter: brightness(85%);
}
.template-img {
  width: 100px;
  height: 100px;
  position: initial;
  overflow: hidden;

  img {
    margin: 1px;
    width: 85%;
  }
}
</style>

<style lang="scss">
.template-img .q-img__container {
  padding: 5px;
}
.template-plugin-img {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25px;
  border: 1px solid black;

  .q-img__container {
    padding: 2px;
  }
}
</style>
