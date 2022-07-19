<template>
  <q-page class="flex flex-center">
    <h1>
      <em class="fa-solid fa-person-digging"></em>
      {{ $t('project.name') }}
    </h1>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
});
</script>
