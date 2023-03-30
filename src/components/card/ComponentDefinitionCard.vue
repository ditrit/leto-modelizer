<template>
  <q-card
    :id="`component-definition-${definition.type}`"
    flat
    bordered
    class="component-definition-card"
    draggable="true"
    :title="definition.description"
    :data-cy="`component-definition_${definition.type}`"
    @dragstart="dragStartHandler"
    @dragend="dragEndHandler"
  >
    <q-item
      clickable
      class="column q-pl-xs q-pr-xs items-center"
      @click="onClickItem"
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
          name="fa-solid fa-circle-info"
          color="info"
          size="xs"
          style="cursor: help"
          data-cy="url-icon"
          @click.stop="$event.preventDefault()"
        >
          <definition-menu :definition="definition" />
        </q-icon>
      </q-item-section>

      <q-item-section>
        <q-item-label class="component-definition-type">
          {{ definition.displayName || definition.type.replaceAll('_', ' ') }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
  addNewComponent,
  addNewTemplateComponent,
  getPluginByName,
} from 'src/composables/PluginManager';
import { useRoute } from 'vue-router';
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
    required: true,
  },
});

const plugin = ref(getPluginByName(props.pluginName));
const projectName = computed(() => route.params.projectName);
const query = computed(() => route.query);

/**
 * Setup drag data.
 *
 * @param {DragEvent} event - The starting drag event.
 */
function dragStartHandler(event) {
  const dragData = {
    pluginName: props.pluginName,
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
 */
async function onClickItem() {
  const defaultFolder = process.env.MODELS_DEFAULT_FOLDER !== ''
    ? `${process.env.MODELS_DEFAULT_FOLDER}/`
    : '';

  if (!props.definition.isTemplate) {
    await addNewComponent(
      projectName.value,
      plugin.value,
      `${defaultFolder}${query.value.path}`,
      props.definition,
    );
    plugin.value.draw('root');
  } else {
    addNewTemplateComponent(
      projectName.value,
      plugin.value,
      `${defaultFolder}${query.value.path}`,
      props.definition,
    ).then(() => {
      plugin.value.draw('root');
    }).catch(() => {
      Notify.create({
        type: 'negative',
        message: t('errors.templates.getData'),
        html: true,
      });
    });
  }
}
</script>

<style scoped>
  .component-definition-type {
    word-break: normal;
    text-align: center;
  }
</style>
