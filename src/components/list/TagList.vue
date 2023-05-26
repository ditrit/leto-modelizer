<template>
  <div>
    <q-chip
      v-for="tag in tags"
      :key="tag.name"
      outline
      clickable
      :color="tag.active ? 'accent' : 'primary'"
      class="no-shadow"
      :data-cy="`${tag.active? 'active' : 'inactive'}-tag_${tag.key}`"
      @click="$emit('toggle:tag', tag.key)"
    >
      {{ $t(`tag.${tag.key}`) }}
    </q-chip>
  </div>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    required: true,
  },
});
defineEmits(['toggle:tag']);
</script>
