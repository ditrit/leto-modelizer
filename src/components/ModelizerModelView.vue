<template>
  <q-layout
    view="lhh lpr lff"
    class="modelizer-model-view"
    data-cy="modelizer-model-view"
  >
    <component-definitions-panel/>
    <q-page-container>
      <q-page>
        ModelizerModelView
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ComponentDefinitionsPanel from 'src/components/drawer/ComponentDefinitionsPanel';
</script>
