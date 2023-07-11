<template>
  <div>
    {{ $t('page.login.completeLogin') }}
  </div>
</template>

<script setup>
import { completeLogin } from 'src/composables/UserAuthentication';
import { onMounted } from 'vue';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

onMounted(() => {
  completeLogin()
    .then(() => {
      router.push('/');
      Notify.create({
        type: 'positive',
        message: t('page.redirect.login'),
        html: true,
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.authentication.completeLogin'),
        html: true,
      });
    });
});
</script>
