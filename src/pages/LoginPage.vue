<template>
  <q-page
    class="login-page"
    data-cy="login-page"
  >
    <section class="fit row justify-center">
      <div class="text-h6 q-pa-xl">
        {{ $t('page.login.message') }}
      </div>
    </section>
    <section
      class="column justify-center items-center"
    >
      <q-card
        v-for="provider in providerList"
        :key="provider.name"
        v-ripple
        class="cursor-pointer q-hoverable q-mb-md"
        clickable
        @click="loginUser(provider.name)"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar size="32px">
              <img
                :src="`provider/${provider.name.toLowerCase()}.svg`"
                :alt="provider.name"
              >
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ $t('page.login.provider', { name: provider.name }) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </section>
  </q-page>
</template>

<script setup>
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { setUserManager, login } from 'src/composables/UserAuthentication';

const { t } = useI18n();
const providerList = computed(() => (process.env.AUTHENTICATION
  ? JSON.parse(process.env.AUTHENTICATION)
  : []));

/**
 * Connect the user with the chosen OIDC provider.
 * @param {providerName} providerName - Name of the OIDC provider.
 */
async function loginUser(providerName) {
  localStorage.setItem('provider', providerName);

  setUserManager(providerName);
  await login().catch(() => {
    Notify.create({
      type: 'negative',
      message: t('errors.authentication.login'),
      html: true,
    });
  });
}
</script>
