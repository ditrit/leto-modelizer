<template>
  <q-card
    flat
    bordered
    class="component-definition-card"
    :title="definition.description"
    :data-cy="`component-definition-${definition.type}`"
  >
    <q-item
      clickable
      @click="onClickItem"
      class="column q-pl-xs q-pr-xs items-center"
    >
      <q-item-section
        v-if="definition.icon"
        avatar
        class="items-center q-pr-none"
      >
        <q-icon
          color="primary"
          size="xl"
          :name="componentIcon"
        />
        <q-btn
          v-if="definition.url"
          flat
          rounded
          color="primary"
          size="xs"
          icon="fa-solid fa-book"
          class="absolute-top-right q-px-xs"
          data-cy="component-definition-url"
          :title="$t('page.modelizer.drawer.documentationLink')"
          :href="$sanitize(definition.url)"
          target="_blank"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label class="component-definition-type">
          {{ definition.type }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import {
  getPluginByName,
  renderPlugin,
} from 'src/composables/PluginManager';
import { getTemplateFileByPath } from 'src/composables/TemplateManager';
import { appendProjectFile } from 'src/composables/Project';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import PluginEvent from 'src/composables/events/PluginEvent';
import { FileInput } from 'leto-modelizer-plugin-core';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const props = defineProps({
  definition: {
    type: Object,
    required: true,
  },
  pluginName: {
    type: String,
    default: '',
  },
});

const componentIcon = computed(() => {
  if (props.definition.isTemplate) {
    return `img:${props.definition.icon}`;
  }
  return `img:/plugins/${props.pluginName}/icons/${props.definition.icon}.svg`;
});

/**
 * On plugin definition click, add a new component to the plugin components.
 * On template definition click, get all related remote files and append them to existing files.
 * Then emit RenderEvent.
 */
async function onClickItem() {
  const { projectName } = route.params;
  const pluginName = props.pluginName || props.definition.plugin;
  let files;

  if (!props.definition.isTemplate) {
    const plugin = getPluginByName(pluginName);

    plugin.data.addComponent(props.definition);
    files = await renderPlugin(pluginName, route.params.projectName);
  } else {
    files = await renderPlugin(pluginName, route.params.projectName);
    await Promise.allSettled(props.definition.files
      .map((file) => getTemplateFileByPath(`templates/${props.definition.key}/${file}`)
        .then((result) => appendProjectFile(projectName, new FileInput({
          path: file,
          content: result.data,
        })))
        .catch(() => {
          Notify.create({
            type: 'negative',
            message: t('errors.templates.getData'),
            html: true,
          });
        })));
  }
  PluginEvent.RenderEvent.next(files);
}
</script>

<style scoped>
  .component-definition-type {
    word-break: break-all;
  }
</style>
