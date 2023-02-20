<template>
  <q-card
    flat
    bordered
    class="component-definition-card full-height"
    draggable="true"
    @dragstart="dragStartHandler"
    @dragend="dragEndHandler"
    :id="`component-definition-${definition.type}`"
    :title="definition.description"
    :data-cy="`component-definition-${definition.type}`"
  >
    <q-item
      clickable
      @click="onClickItem"
      class="column q-pl-xs q-pr-xs items-center full-height"
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
        <q-icon
          v-if="definition.url"
          class="absolute-top-right q-ma-xs"
          data-cy="component-definition-url"
          name="fa-solid fa-circle-info"
          color="info"
          size="xs"
          @click.stop="$event.preventDefault()"
          style="cursor: help"
        >
          <definition-menu :definition="definition"/>
        </q-icon>
      </q-item-section>

      <q-item-section top class="q-mt-xs">
        <q-item-label class="component-definition-type">
          {{ definition.displayName || definition.type.replaceAll('_', ' ') }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';
import {
  getPluginByName,
  renderModel,
} from 'src/composables/PluginManager';
import { generateTemplate, getTemplateFileByPath } from 'src/composables/TemplateManager';
import { appendProjectFile } from 'src/composables/Project';
import { useRoute } from 'vue-router';
import PluginEvent from 'src/composables/events/PluginEvent';
import { FileInput } from 'leto-modelizer-plugin-core';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import DefinitionMenu from 'components/menu/DefinitionMenu.vue';

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

/**
 * Setup drag data.
 *
 * @param {DragEvent} event - The starting drag event.
 */
function dragStartHandler(event) {
  const dragData = {
    pluginName: props.pluginName || props.definition.plugin,
    isTemplate: props.definition.isTemplate,
    definitionType: props.definition.isTemplate ? props.definition.key : props.definition.type,
  };
  const overlayElement = document.getElementById('overlay');

  event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  overlayElement.style.display = 'block';
  event.dataTransfer.dropEffect = 'copy';
}

/**
 * Hide overlay after dropping a component.
 */
function dragEndHandler() {
  const overlayElement = document.getElementById('overlay');

  overlayElement.style.display = 'none';
}

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
  const plugin = getPluginByName(pluginName);
  const modelFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/${route.query.path}`
    : `${route.query.path}`;

  let files;

  if (!props.definition.isTemplate) {
    plugin.data.addComponent(props.definition, `${modelFolder}/`);

    files = await renderModel(route.params.projectName, modelFolder, plugin);
  } else {
    files = await renderModel(route.params.projectName, modelFolder, plugin);

    await Promise.allSettled(props.definition.files
      .map((file) => getTemplateFileByPath(`templates/${props.definition.key}/${file}`)
        .then((result) => appendProjectFile(projectName, new FileInput({
          path: `${modelFolder}/${file}`,
          content: generateTemplate(result.data),
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
    word-break: normal;
    text-align: center;
  }
</style>
