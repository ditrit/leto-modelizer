<template>
  <div>
    {{ $t('page.login.completeSilentLogin') }}
  </div>
</template>

<script setup>
import { completeSilentLogin } from 'src/composables/UserAuthentication';
import { onMounted } from 'vue';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

onMounted(() => {
  completeSilentLogin()
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.authentication.completeSilentLogin'),
        html: true,
      });
    });
});
</script>
