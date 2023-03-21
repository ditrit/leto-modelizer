<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        {{ $t('error404.title') }}
      </div>

      <div
        class="text-h2"
        style="opacity:.4"
      >
        {{ $t('error404.content') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="primary"
        unelevated
        to="/"
        :label="$t('actions.default.goToHome')"
        no-caps
      />
    </div>
  </div>
</template>
