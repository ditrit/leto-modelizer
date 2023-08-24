<template>
  <q-page
    class="splash-page flex justify-center items-center"
    data-cy="splash-page"
  >
    <q-card class="bg-primary shadow-2">
      <q-card-section class="flex column justify-center items-center text-white">
        <div class="flex items-center text-h5">
          <q-img class="logo" />
          <label>{{ $t('application.name') }}</label>
        </div>
        <div class="q-pt-md text-bold">
          {{ $t('page.splash.wait') }}
        </div>
        <div class="text-bold q-mb-md">
          {{ $t('page.splash.info') }}
        </div>
        <q-spinner-gears
          color="white"
          size="4rem"
          indeterminate
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { initPlugins } from 'src/composables/PluginManager';
import PluginEvent from 'src/composables/events/PluginEvent';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await initPlugins();
  PluginEvent.InitEvent.next();

  // Wait 2s to avoid blinking effect and let user admire our beautiful splash screen.
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((res) => setTimeout(res, 2000));

  router.push(route.query.from === route.path ? { name: 'Home' } : route.query.from || { name: 'Home' });
});
</script>

<style lang="scss" scoped>
.splash-page {
  background-image: url('/splash.png');
  background-repeat: no-repeat;
  background-size: cover;
}
.logo {
  width: 100px;
  height: 100px;
  margin: 0;
}
</style>
