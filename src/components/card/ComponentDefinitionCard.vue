<template>
  <q-card
    :id="`component-definition-${definition.type}`"
    v-ripple
    flat
    bordered
    class="component-definition-card cursor-pointer q-hoverable"
    draggable="true"
    :title="definition.description"
    :data-cy="!definition.isTemplate
      ? `component-definition_${definition.type}`
      : `component-definition_${definition.name}`"
    @click="onClickItem"
    @dragstart="dragStartHandler"
  >
    <span class="q-focus-helper" />
    <q-item
      class="column q-pl-xs q-pr-xs items-center"
    >
      <q-item-section
        v-if="definition.icon"
        avatar
        class="items-center q-pr-none"
      >
        <q-icon
          v-if="!definition.isTemplate"
          color="primary"
          size="xl"
          :name="componentIcon"
        />
        <q-img
          v-else-if="componentIcon"
          class="rounded-borders template-img bg-white"
          :src="componentIcon"
          :alt="definition.name"
          fit="contain"
          width="48px"
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
          <template v-if="definition.isTemplate">
            {{ definition.name }}
          </template>
          <template v-else>
            {{ definition.displayName || definition.type.replaceAll('_', ' ') }}
          </template>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  toRef,
} from 'vue';
import {
  addNewTemplateComponent,
  getPluginByName,
  renderModel,
} from 'src/composables/PluginManager';
import { useRoute } from 'vue-router';
import DefinitionMenu from 'components/menu/DefinitionMenu.vue';
import { getTemplateIcon } from 'src/services/ImageDownloadService';

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

const plugin = ref(getPluginByName(toRef(props, 'pluginName').value));
const projectName = computed(() => route.params.projectName);
const query = computed(() => route.query);

/**
 * Setup drag data.
 * @param {DragEvent} event - The starting drag event.
 */
function dragStartHandler(event) {
  const dragData = {
    pluginName: props.pluginName,
    definition: props.definition,
  };

  event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  event.dataTransfer.dropEffect = 'copy';
}

const componentIcon = ref(null);

/**
 * Load icon of the template
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function loadTemplateIcon() {
  if (props.definition.isTemplate) {
    componentIcon.value = await getTemplateIcon({
      HAS_BACKEND: process.env.HAS_BACKEND,
      TEMPLATE_LIBRARY_BASE_URL: process.env.TEMPLATE_LIBRARY_BASE_URL,
    }, props.definition);
    return;
  }

  componentIcon.value = `img:/plugins/${props.pluginName}/icons/${props.definition.icon}.svg`;
}

/**
 * On plugin definition click, add a new component to the plugin components.
 * On template definition click, get all related remote files and append them to existing files.
 */
async function onClickItem() {
  const componentPath = query.value.path
    ? `${projectName.value}/${query.value.path}`
    : projectName.value;

  if (!props.definition.isTemplate) {
    plugin.value.addComponent(
      null,
      props.definition,
      componentPath,
    );
  } else {
    await addNewTemplateComponent(
      projectName.value,
      plugin.value,
      componentPath,
      props.definition,
    );
  }

  plugin.value.arrangeComponentsPosition(null, true);

  plugin.value.draw();

  await renderModel(
    projectName.value,
    query.value.path,
    plugin.value,
  );
}

onMounted(() => {
  loadTemplateIcon();
});
</script>

<style scoped>
  .component-definition-type {
    word-break: break-all;
    text-align: center;
  }
</style>
