<template>
  <q-item clickable>
    <q-item-section avatar>
      <q-icon
        v-if="isCurrentBranch"
        color="primary"
        name="fa-solid fa-tag"
        data-cy="git-menu-current-branch"
      >
        <q-tooltip>
          {{ $t('menu.git.currentBranch') }}
        </q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section>
      {{ name }}
    </q-item-section>
    <q-item-section class="text-right text-grey-8">
      {{ fullName }}
    </q-item-section>
    <q-item-section side>
      <q-icon name="fa-solid fa-angle-right" />
    </q-item-section>
    <git-branch-action-menu
      anchor="top end"
      self="top start"
      :is-current-branch="isCurrentBranch"
      :on-local="onLocal"
      :on-remote="onRemote"
      :branch-name="name"
      @action:done="emit('action:done')"
    />
  </q-item>
</template>

<script setup>

import GitBranchActionMenu from 'components/menu/GitBranchActionMenu.vue';

const emit = defineEmits(['action:done']);

defineProps({
  name: {
    type: String,
    required: true,
  },
  isCurrentBranch: {
    type: Boolean,
    default: false,
  },
  onLocal: {
    type: Boolean,
    default: false,
  },
  onRemote: {
    type: Boolean,
    default: false,
  },
  fullName: {
    type: String,
    required: true,
  },
});
</script>
