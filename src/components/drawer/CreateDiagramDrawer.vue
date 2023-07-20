<template>
  <q-drawer
    no-swipe-close
    bordered
    :width="630"
    side="right"
    class="create-diagram-drawer column no-wrap"
    data-cy="create-diagram-drawer"
  >
    <q-list class="column no-wrap full-height">
      <q-item class="list-item">
        <q-item-section>
          <q-item-label
            overline
            header
            class="row items-center justify-between"
          >
            <label>
              {{ $t('page.models.drawer.title') }}
            </label>
            <q-input
              v-model="searchTemplateText"
              outlined
              dense
              clearable
              class="search-bar"
              :label="$t('page.models.drawer.search')"
              data-cy="search-template-input"
              @update:model-value="updateTemplates"
            >
              <template #prepend>
                <q-icon
                  name="fa-solid fa-magnifying-glass"
                  size="xs"
                />
              </template>
            </q-input>
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            round
            flat
            icon="fa-solid fa-xmark"
            data-cy="close-button"
            @click="$emit('update:modelValue', false)"
          />
        </q-item-section>
      </q-item>
      <q-item class="list-item">
        <q-item-section>
          <q-item-label header>
            {{ $t('page.models.drawer.list') }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="list-item">
        <q-item-section>
          <q-select
            v-model="selectedLanguage"
            outlined
            dense
            clearable
            class="language-select"
            :label="$t('page.models.drawer.select')"
            :options="languages"
            data-cy="language-select"
            @update:model-value="updateTemplates"
          >
            <template #option="{ selected, opt, toggleOption }">
              <q-item
                :active="selected"
                clickable
                @click="toggleOption(opt)"
              >
                <q-item-section :data-cy="`item_${opt}`">
                  {{ opt }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-item-section>
      </q-item>
      <q-item class="list-item-shrink">
        <q-item-section>
          <q-scroll-area style="height: 100%">
            <div class="template-card-container row items-center wrap">
              <div
                v-for="template in templates"
                :key="template.key"
                :class="[
                  'template-card-item',
                  'row', 'q-mb-md',
                  'justify-center',
                  'items-center',
                  'q-pa-sm',
                  'rounded-borders',
                  { selected: selectedTemplate === template.key },
                ]"
                @click="toggleTemplate(template.key)"
              >
                <template-card
                  :v-ripple="false"
                  :template="template"
                  class="text-center"
                />
              </div>
              <div
                v-if="templates.length === 0"
                class="row text-center text-subtitle2 text-grey q-mb-md"
              >
                {{ $t('page.models.drawer.empty') }}
              </div>
            </div>
          </q-scroll-area>
        </q-item-section>
      </q-item>
      <q-item class="list-item q-mb-md">
        <q-item-section>
          <div class="row items-center justify-end">
            <q-btn
              v-close-popup
              :label="$t(`actions.default.cancel`)"
              flat
              type="reset"
              color="negative"
              data-cy="cancel-button"
              @click="$emit('update:modelValue', false)"
            />
            <q-btn
              :label="$t(`actions.default.ok`)"
              class="q-ml-xl q-mr-md"
              type="submit"
              color="positive"
              data-cy="submit-button"
              :disable="!selectedTemplate"
              @click="openImportModelTemplateDialog()"
            >
              <template #loading>
                <q-spinner-dots />
              </template>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { getTemplatesByType } from 'src/composables/TemplateManager';
import TemplateCard from 'components/card/TemplateCard.vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import DrawerEvent from 'src/composables/events/DrawerEvent';
import { searchText } from 'src/composables/Filter';
import { getAllTagsByType, getPluginTags } from 'src/composables/PluginManager';

const emit = defineEmits(['update:modelValue']);
const searchTemplateText = ref(null);
const templates = ref([]);
const selectedTemplate = ref(null);
const selectedLanguage = ref(null);
const languages = ref(getAllTagsByType('language'));
let drawerEventSubscription;
let allTemplates = [];

/**
 * Open ImportModelTemplate dialog.
 */
async function openImportModelTemplateDialog() {
  emit('update:modelValue', false);
  DialogEvent.next({
    type: 'open',
    key: 'ImportModelTemplate',
    template: templates.value.find(({ key }) => key === selectedTemplate.value),
  });
}

/**
 * Toggle selected template.
 * @param {String} key - Key of template to toggle.
 */
function toggleTemplate(key) {
  if (selectedTemplate.value === key) {
    selectedTemplate.value = null;
  } else {
    selectedTemplate.value = key;
  }
}

/**
 * Update templates list.
 */
function updateTemplates() {
  if (!selectedLanguage.value) {
    templates.value = allTemplates
      .filter(({ type }) => searchText(type, searchTemplateText.value));
  } else {
    templates.value = allTemplates
      .filter(({ type }) => searchText(type, searchTemplateText.value))
      .map((template) => ({
        template,
        tags: getPluginTags(template.plugin).filter(({ type }) => type === 'language'),
      }))
      .filter(({ tags }) => tags.map(({ value }) => value).includes(selectedLanguage.value))
      .map(({ template }) => template);
  }
}

/**
 * Reset all inputs.
 */
function reset() {
  searchTemplateText.value = null;
  selectedTemplate.value = null;
  selectedLanguage.value = null;
  templates.value = allTemplates;
}

/**
 * Open or close drawer on event.
 * @param {Object} event - Event.
 * @param {String} event.key - Identifier of drawer.
 * @param {String} event.type - Action type, 'open' or 'close'.
 */
function onDrawerEvent({ key, type }) {
  if (key !== 'CreateDiagram') {
    return;
  }

  const isOpen = type === 'open';

  if (isOpen) {
    reset();
  }

  emit('update:modelValue', isOpen);
}

onMounted(async () => {
  drawerEventSubscription = DrawerEvent.subscribe(onDrawerEvent);
  allTemplates = await getTemplatesByType('model');

  updateTemplates();
});

onUnmounted(() => {
  drawerEventSubscription.unsubscribe();
});
</script>

<style scoped lang="scss">
/* Override q-drawer "overflow" property to manually set the scroll */
.create-diagram-drawer {
  overflow: hidden !important;
}
.list-item {
  flex-grow: 1;
}
.list-item-shrink {
  flex-basis: 100%;
  overflow: hidden;
}
.template-card-container {
  overflow-y: auto;
  max-height: 100%;
}

.template-card-item {
  flex-basis: calc(100% / 8);
  min-width: 125px;
  border: 1px solid white;

  &.selected {
    border: 1px solid $accent;
  }
}
.language-select, .search-bar {
  max-width: 250px;
  width: 250px;
}
</style>
