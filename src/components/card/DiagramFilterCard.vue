<template>
  <q-card
    flat
    bordered
  >
    <q-card-section class="row justify-end">
      <tag-select-input
        :model-value="selectedTags"
        :tags="tags"
        data-cy="diagram-tag-select"
        @update:model-value="(value) => $emit('update:selectedTags', value)"
      />
      <q-input
        :model-value="searchText"
        outlined
        dense
        clearable
        class="search-bar q-mr-md"
        :label="$t('actions.models.search')"
        data-cy="search-diagram-input"
        @update:model-value="(value) => $emit('update:searchText', value)"
      >
        <template #prepend>
          <q-icon
            name="fa-solid fa-magnifying-glass"
            size="xs"
          />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script setup>
import TagSelectInput from 'components/inputs/TagSelectInput.vue';

defineEmits(['update:selectedTags', 'update:searchText']);
defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
  selectedTags: {
    type: Array,
    default: () => [],
  },
  searchText: {
    type: String,
    default: () => null,
  },
});
</script>
