<template>
  <q-select
    :model-value="modelValue"
    :options="tags"
    dense
    outlined
    multiple
    color="accent"
    options-selected-class="text-accent"
    class="search-bar-input q-mr-md"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <template #selected>
      <div
        v-if="modelValue.length === 0"
        class="text-grey-8"
      >
        {{ $t('actions.models.tag.select') }}
      </div>
      <q-chip
        v-for="tag in modelValue"
        :key="tag"
        dense
        color="accent"
        text-color="white"
        removable
        icon-remove="fa-solid fa-close"
        :data-cy="`chip_${tag}`"
        @remove="unselectTag(tag)"
      >
        {{ tag }}
      </q-chip>
    </template>
    <template #option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps">
        <q-item-section side>
          <q-checkbox
            :model-value="selected"
            color="accent"
            :data-cy="`select-checkbox_${opt}`"
            @update:model-value="toggleOption(opt)"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ opt }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  tags: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['update:modelValue']);
const selectedTags = ref(props.modelValue);

/**
 * Emit an update event to remove tag.
 * @param {String} tag - Tag to remove.
 */
function unselectTag(tag) {
  emit('update:modelValue', selectedTags.value.filter((selectedTag) => selectedTag !== tag));
}

watch(() => props.modelValue, (value) => {
  selectedTags.value = value;
});
</script>

<style scoped lang="scss">
.search-bar-input {
  min-width: 300px;
}
</style>
