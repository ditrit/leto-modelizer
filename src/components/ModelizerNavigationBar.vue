<template>
  <q-header class="modelizer-navigation-bar shadow-1 row justify-between items-center">
    <div class="app-homepage-link">
      <router-link
        class="app-logo-link"
        data-cy="app-logo-link"
        to="/"
      >
        <q-icon
          class="app-logo"
          name="img:icons/logo_modelizer.svg"
          :left="true"
        />
        <label class="app-logo-label vertical-middle">
          {{ $t('application.name') }}
        </label>
      </router-link>
    </div>
    <div class="project-info">
      <span class="project-name">{{ projectName }}</span>
    </div>
    <div class="view-switch">
      <q-btn-toggle
        v-model="buttonToggleValue"
        :options="buttonToggleOptions"
        @update:model-value="onViewSwitchUpdate"
        class="view-selector"
        toggle-color="primary"
        text-color="primary"
        color="white"
        no-caps
        data-cy="modelizer-switch"
        rounded
      >
        <template v-slot:content="label">
          <span data-cy="content">{{ label }}</span>
        </template>
      </q-btn-toggle>
    </div>
  </q-header>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';

const { t } = useI18n();
const props = defineProps({
  viewType: String,
  projectName: String,
});
const buttonToggleValue = ref(props.viewType);
const buttonToggleOptions = ref([{
  label: t('page.modelizer.header.switch.model'),
  value: 'model',
  slot: 'content',
}, {
  label: t('page.modelizer.header.switch.text'),
  value: 'text',
  slot: 'content',
}]);
const projectName = computed(() => props.projectName);

/**
 * Emit event with the new view type.
 *
 * @param {string} newViewType
 */
function onViewSwitchUpdate(newViewType) {
  if (newViewType === props.viewType) return;
  ViewSwitchEvent.emit(newViewType);
}

watch(() => props.viewType, (newViewType) => {
  buttonToggleValue.value = newViewType;
});
</script>

<style lang="scss" scoped>
.modelizer-navigation-bar {
  background-color: white;
  color: $primary;
  padding: 1rem;
  position: relative;

  .app-logo-link {
    text-decoration: none;

    .app-logo {
      background-color: $primary;
      font-size: 2rem;
    }
    .app-logo-label{
      cursor: pointer;
      color: $primary;
      font-weight: bold;
      font-size: large;
    }
  }
  .project-name {
    font-weight: bold;
    font-size: large;
  }
}
</style>
