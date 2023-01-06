<template>
  <q-header
    class="bg-primary text-white shadow-1 row justify-between items-center q-px-lg"
  >
    <div class="app-homepage-link">
      <router-link
        class="app-logo-link"
        data-cy="app-logo-link"
        to="/"
      >
        <q-icon
          color="primary"
          size="4rem"
          name="img:icons/logo_modelizer.svg"
          :left="true"
        />
        <label class="app-logo-label vertical-middle">
          {{ $t('application.name') }}
        </label>
      </router-link>
    </div>
    <div class="project-info">
      <span
        class="project-name"
        data-cy="project-name"
      >
        {{ props.projectName }}
      </span>
    </div>
    <div class="row justify-between items-center">
      <q-btn
        :disable="isSaveButtonDisable"
        :loading="isLoading"
        :label="$t('page.modelizer.header.button.save.label')"
        :title="$t(savebuttonTitle)"
        @click="save()"
        color="positive"
        class="q-mr-md"
      >
        <template v-slot:loading>
          <q-spinner-dots/>
        </template>
      </q-btn>
      <q-btn-toggle
        v-model="buttonToggleValue"
        :options="buttonToggleOptions"
        @update:model-value="onViewSwitchUpdate"
        class="view-selector q-mr-md"
        toggle-color="accent"
        text-color="accent"
        color="white"
        no-caps
        data-cy="modelizer-switch"
        rounded
      />
      <modelizer-settings-menu/>
    </div>
  </q-header>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ViewSwitchEvent from 'src/composables/events/ViewSwitchEvent';
import ModelizerSettingsMenu from 'components/menu/ModelizerSettingsMenu.vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import { Notify } from 'quasar';
import {
  getProjectById,
  gitGlobalSave,
} from 'src/composables/Project';

const { t } = useI18n();
const props = defineProps({
  viewType: String,
  projectName: String,
});
const isLoading = ref(false);
const buttonToggleValue = ref(props.viewType);
const buttonToggleOptions = computed(() => [{
  label: t('page.modelizer.header.switch.model'),
  value: 'model',
  slot: 'content',
}, {
  label: t('page.modelizer.header.switch.text'),
  value: 'text',
  slot: 'content',
}]);

const project = computed(() => getProjectById(props.projectName));
const isSaveButtonDisable = computed(() => !project.value.git?.repository);
const savebuttonTitle = computed(() => {
  if (isSaveButtonDisable.value) {
    return 'page.modelizer.header.button.save.disable.title';
  }
  return 'page.modelizer.header.button.save.enable.title';
});

/**
 * Save global modifications and notify according to the result.
 */
async function save() {
  isLoading.value = true;

  await gitGlobalSave(project.value)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('page.modelizer.header.button.save.success'),
        html: true,
      });
    })
    .catch(() => {
      Notify.create({
        type: 'negative',
        message: t('page.modelizer.header.button.save.error'),
        html: true,
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

/**
 * Emit event with the new view type.
 *
 * @param {string} newViewType
 */
function onViewSwitchUpdate(newViewType) {
  if (newViewType === props.viewType) return;
  ViewSwitchEvent.next(newViewType);
  if (newViewType === 'text') {
    PluginEvent.RenderEvent.next();
  } else {
    PluginEvent.ParseEvent.next();
  }
}

watch(() => props.viewType, (newViewType) => {
  buttonToggleValue.value = newViewType;
});
</script>

<style lang="scss" scoped>
// .q-header {
//   position: relative;
// }
.app-logo-link {
  text-decoration: none;

  .app-logo-label{
    cursor: pointer;
    color: white;
    font-size: medium;
  }
}
.project-name {
  font-weight: bold;
  font-size: large;
}
</style>
