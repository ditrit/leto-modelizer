<template>
  <q-card
    v-ripple
    class="model-card cursor-pointer"
    :data-cy="`model-card_${model.plugin}-${model.name}`"
  >
    <q-img
      :src="getModelImage()"
      height="100%"
    >
      <div
        class="absolute-bottom text-subtitle2 text-center"
        data-cy="title-container"
      >
        <div class="text-bold">
          {{ model.name }}
        </div>
        <div class="text-italic">
          {{ model.plugin }}
        </div>
        <q-btn
          class="q-mr-md"
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
      </div>
    </q-img>
  </q-card>
</template>

<script setup>
import DialogEvent from 'src/composables/events/DialogEvent';

const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
});

/**
 * Get image of model.
 * Transform model name to a number between 0 and 4 and return associated image.
 * @return {String} Image path.
 */
function getModelImage() {
  const number = props.model.name.split('')
    .map((char) => char.charCodeAt(0))
    .reduce((acc, value) => acc + value) % 5;
  return `images/project${number}.png`;
}
</script>

<style scoped>
.model-card {
  width: 150px;
  height: 150px;
}
</style>
