<template>
  <q-page
    class="about-page"
    data-cy="modelizer-page"
  >
    <div class="row col-md-6 justify-center items-center bg-primary about-banner">
      <router-link
        class="col-1"
        data-cy="go-to-homepage"
        to="/"
      >
        <q-img
          src="icons/logo_modelizer.svg"
          class="about-logo"
          :ratio="1"
        />
      </router-link>
      <h2 class="text-white col-auto">
        {{ $t('page.about.title') }}
      </h2>
    </div>
    <div class="q-mb-lg about-content">
      <div class="fit row justify-center">
        <q-btn
          color="primary"
          text-color="white"
          unelevated
          to="/"
          :label="$t('actions.default.goToHome')"
          no-caps
        />
      </div>
      <section class="fit row justify-center">
        <div class="col-md-6">
          <h4>
            {{ $t('page.about.letoModelizer.title') }}
          </h4>
          <div class="row">
            <q-img
              src="icons/logo_modelizer.svg"
              fit="contain"
              class="col-3 bg-primary rounded-borders leto-logo"
            />
            <div class="col column justify-between q-pl-lg text-body1 text-justify">
              <div>
                {{ $t('page.about.letoModelizer.description') }}
              </div>
              <div class="row items-center">
                <q-icon
                  color="primary"
                  name="fa-brands fa-github"
                  class="q-mr-sm"
                />
                <a
                  :href="$sanitize(`https://github.com/ditrit/leto-modelizer`)"
                  target="_blank"
                  class="text-primary"
                >
                  {{ $t('page.about.letoModelizer.github') }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="fit row justify-center">
        <div class="col-md-6 q-mt-md">
          <h4>
            {{ $t('page.about.ditrit.title') }}
          </h4>
          <div class="row justify-center">
            <q-img
              src="https://ditrit.io/images/ditrit_logo.svg"
              class="col-3"
              height="fit-content"
              fit="contain"
            />
            <div class="col column justify-between q-pl-lg text-body1 text-justify">
              <div>
                {{ $t('page.about.ditrit.description') }}
              </div>
              <div class="flex q-mt-md">
                <div class="row items-center q-mr-md">
                  <q-icon
                    color="primary"
                    class="q-mr-sm"
                    name="fa-solid fa-link"
                  />
                  <a
                    :href="$sanitize(`https://ditrit.io/`)"
                    target="_blank"
                    class="text-primary"
                  >
                    {{ $t('page.about.ditrit.website') }}
                  </a>
                </div>
                <div class="row items-center">
                  <q-icon
                    color="primary"
                    name="fa-brands fa-github"
                    class="q-mr-sm"
                  />
                  <a
                    :href="$sanitize(`https://github.com/ditrit`)"
                    target="_blank"
                    class="text-primary"
                  >
                    {{ $t('page.about.ditrit.github') }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="fit row justify-center">
        <div class="col-md-6 q-mt-md">
          <h4>
            {{ $t('page.about.team.title') }}
          </h4>
          <div class="row justify-center q-col-gutter-md">
            <div
              v-for="(people, index) in about.management"
              :key="index"
              class="col-12 col-md-6 col-lg-4 q-mb-lg"
            >
              <q-card flat bordered>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar size="80px">
                      <img
                        v-if="people.avatar"
                        :src="people.avatar"
                        :alt="people.name"
                      >
                      <q-icon
                        v-else
                        color="primary"
                        name="fa-solid fa-user-tie"
                        class="q-mr-sm"
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{  people.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ people.job }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </div>
          <div class="row justify-center q-col-gutter-md">
            <div
              v-for="(people, index) in about.team"
              :key="index"
              class="col-12 col-md-6 col-lg-4"
            >
              <q-card flat bordered>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar size="80px">
                      <img
                        v-if="people.avatar"
                        :src="people.avatar"
                        :alt="people.name"
                      >
                      <q-icon
                        v-else
                        color="primary"
                        name="fa-solid fa-user-ninja"
                        class="q-mr-sm"
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{  people.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ people.job }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </div>
        </div>
      </section>
      <section
        v-if="about.sponsors.length > 0"
        class="fit row justify-center"
      >
        <div class="col-8 col-md-6 q-mt-md">
          <h4>
            {{ $t('page.about.sponsors.title') }}
          </h4>
          <div class="row justify-center q-col-gutter-md">
            <a
              v-for="(sponsor, index) in about.sponsors"
              :key="index"
              :href="$sanitize(`${sponsor.link}`)"
              class="col-12 col-sm-6 col-lg-4"
              target="_blank"
            >
              <q-card
                flat bordered
                class="full-height"
              >
                <q-item
                  class="row items-center full-height"
                >
                  <q-img :src="sponsor.avatar"/>
                </q-item>
              </q-card>
            </a>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import about from 'src/assets/about.json';
</script>

<style lang="scss" scoped>
.about-page {
  .about-banner {
    min-height: 30vh;
    max-height: 50vh;
  }
  .about-content {
    margin: 5vh;
  }
  .leto-logo {
    max-height: 145px;
  }
}
</style>
