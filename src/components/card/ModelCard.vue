<template>
  <q-card class="row">
    <q-item>
      <q-item-section avatar>
        <q-img
          :src="`/plugins/${model.plugin}/icons/logo.svg`"
          width="40px"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          {{ model.path || '/' }}
        </q-item-label>
        <q-item-label caption>
          {{ $t(`${model.plugin}.displayName`) }}
        </q-item-label>
        <q-item-label caption>
          <q-chip
            v-for="(tag, index) in model.tags"
            :key="index"
            dense
            :outline="false"
            color="accent"
            text-color="white"
            :label="tag.value"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section class="column items-center justify-center">
        <q-btn
          class="q-mb-md"
          :title="$t('actions.models.delete.button.title')"
          size="xs"
          round
          color="negative"
          icon="fa-solid fa-trash"
          data-cy="delete-button"
          @click.prevent.stop="DialogEvent.next({
            type: 'open',
            key: 'DeleteModel',
            model,
          })"
        />
        <q-btn
          class="q-mr-none"
          :title="$t('actions.models.rename.button.title')"
          size="xs"
          round
          color="primary"
          icon="fa-solid fa-pen"
          data-cy="rename-button"
          @click.prevent.stop="DialogEvent.next({
            type: 'open',
            key: 'RenameModel',
            model,
          })"
        />
      </q-item-section>
    </q-item>
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
