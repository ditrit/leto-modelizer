<template>
  <q-card
    :data-cy="`model-card$-${model.plugin}-${model.name}`"
  >
    <q-card-section>
      {{ model.name }}
    </q-card-section>
    <q-card-section>
      {{ model.plugin }}
    </q-card-section>
    <q-card-actions>
      <q-btn
        class="q-mr-md"
        :title="$t('actions.models.delete.button.title')"
        size="xs"
        round
        flat
        color="negative"
        icon="fa-solid fa-trash"
        data-cy="model-delete-button"
        @click.prevent.stop="DialogEvent.next({
          type: 'open',
          key: 'DeleteModel',
          model,
        })"
      />
      <q-btn
        class="q-mr-md"
        :title="$t('actions.models.rename.button.title')"
        size="xs"
        round
        flat
        color="primary"
        icon="fa-solid fa-pen"
        data-cy="model-rename-button"
        @click.prevent.stop="DialogEvent.next({
          type: 'open',
          key: 'RenameModel',
          model,
        })"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';

defineProps({
  model: {
    type: Object,
    required: true,
  },
});
</script>
