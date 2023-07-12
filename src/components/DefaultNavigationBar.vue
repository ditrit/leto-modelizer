<template>
  <q-header
    class="bg-primary text-white shadow-1 row justify-between items-center q-px-lg"
    data-cy="navigation-bar"
  >
    <div class="application-name">
      <q-img
        class="logo"
        left
      />
      <label
        class="vertical-middle cursor-pointer text-white text-subtitle1"
      >
        {{ $t('application.name') }}
      </label>
      <a :href="getFeedbacksUrl()" target="_blank">
        <q-btn
          outline
          no-caps
          class="q-ml-xl"
          color="primary"
          icon="fa-solid fa-envelope"
          :label="$t('page.modelizer.header.button.feedbacks.label')"
          :title="$t('page.modelizer.header.button.feedbacks.title')"
          data-cy="feedbacks-button"
        />
      </a>
    </div>
  </q-header>
</template>

<script setup>
import { getFeedbacksUrl } from 'src/composables/Project';
</script>

<style lang="scss" scoped>
.bg-primary {
  background: #15314D !important;
}
</style>
