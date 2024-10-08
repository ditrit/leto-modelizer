<template>
  <q-list data-cy="component-definitions-list">
    <q-item>
      <q-item-section>
        <q-item-label
          overline
          header
        >
          {{ $t('page.modelizer.drawer.components.header') }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <div class="row justify-center">
    <q-btn
      :label="$t('page.modelizer.button.back.label')"
      :title="$t('page.modelizer.button.back.title')"
      color="positive"
      class="q-mr-md"
      no-caps
      data-cy="models-page-link-button"
      @click="router.push(`/projects/${projectName}/models`)"
    />
  </div>
  <library-list
    :plugin="plugin"
  />
</template>

<script setup>
import LibraryList from 'src/components/list/LibraryList.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  plugin: {
    type: Object,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
});
</script>
