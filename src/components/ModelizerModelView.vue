<template>
  <q-layout
    view="lhh lpr lff"
    class="modelizer-model-view"
    data-cy="modelizer-model-view"
  >
    <component-definitions-drawer/>
    <q-page-container>
      <q-page>
        ModelizerModelView
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ComponentDefinitionsDrawer from 'src/components/drawer/ComponentDefinitionsDrawer';
</script>
