<template>
  <q-item clickable>
    <q-item-section avatar>
      <q-icon
        color="primary"
        name="fa-solid fa-tag"
        v-if="current"
        data-cy="git-menu-current-branch"
      >
        <q-tooltip>
          {{$t('menu.git.currentBranch')}}
        </q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section>{{name}}</q-item-section>
    <q-item-section class="text-right text-grey-8">{{fullName}}</q-item-section>
    <q-item-section side>
      <q-icon name="fa-solid fa-angle-right"/>
    </q-item-section>
    <git-branch-action-menu
      anchor="top end"
      self="top start"
      :isCurrentBranch="current"
      :on-local="onLocal"
      :on-remote="onRemote"
      :branch-name="name"
    />
  </q-item>
</template>

<script setup>

import GitBranchActionMenu from 'components/menu/GitBranchActionMenu';

defineProps({
  name: {
    type: String,
    required: true,
  },
  current: {
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
  fullName: String,
});
</script>
