<template>
  <default-drawer
    :has-close-btn="false"
    class="components-definitions-drawer column no-wrap"
    data-cy="components-definitions-drawer"
  >
    <template #drawerName>
      {{ $t('page.modelizer.drawer.components.header') }}
    </template>
    <template #content>
      <div class="row justify-center">
        <q-btn
          :label="$t('page.modelizer.button.back.label')"
          :title="$t('page.modelizer.button.back.title')"
          color="positive"
          class="q-mr-md"
          no-caps
          data-cy="models-page-link-button"
          @click="router.push(`/${projectName}/models`)"
        />
      </div>
      <library-list
        :plugin="plugin"
        :templates="templates"
      />
    </template>
  </default-drawer>
</template>

<script setup>
import DefaultDrawer from 'src/components/drawer/DefaultDrawer';
import LibraryList from 'src/components/list/LibraryList';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  plugin: {
    type: Object,
    required: true,
  },
  templates: {
    type: Array,
    default: () => [],
  },
  projectName: {
    type: String,
    required: true,
  },
});
</script>

<style>
 /* Override q-drawer "overflow" property to manually set the scroll */
.components-definitions-drawer {
  overflow: hidden !important;
}
</style>
