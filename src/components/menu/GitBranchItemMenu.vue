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
  </q-item>
</template>

<script setup>

defineProps({
  name: {
    type: String,
    required: true,
  },
  current: {
    type: Boolean,
    default: false,
  },
  fullName: String,
});
</script>
