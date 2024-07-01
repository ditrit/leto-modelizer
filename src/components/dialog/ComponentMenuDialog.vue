<template>
  <q-dialog
    v-model="show"
    class="component-menu-dialog"
    transition-show="jump-down"
    transition-hide="jump-up"
  >
    <q-card :style="dialogStyle">
      <q-card-section class="q-pa-none">
        <q-list
          bordered
          separator
        >
          <q-item
            v-ripple
            v-close-popup
            clickable
            data-cy="edit-button"
            @click="sendEvent('edit')"
          >
            <q-item-section
              class="short-avatar"
              avatar
            >
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-pen"
              />
            </q-item-section>
            <q-item-section class="q-pl-none">
              Edit
            </q-item-section>
          </q-item>

          <q-item
            v-if="isContainer"
            v-ripple
            v-close-popup
            clickable
            data-cy="fit-fo-content-button"
            @click="sendEvent('fitToContent')"
          >
            <q-item-section
              class="short-avatar"
              avatar
            >
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-minimize"
              />
            </q-item-section>
            <q-item-section class="q-pl-none">
              Fit to content
            </q-item-section>
          </q-item>

          <q-item
            v-if="isContainer"
            v-ripple
            v-close-popup
            clickable
            data-cy="arrange-content-button"
            @click="sendEvent('arrangeContent')"
          >
            <q-item-section
              class="short-avatar"
              avatar
            >
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-boxes-stacked"
              />
            </q-item-section>
            <q-item-section class="q-pl-none">
              Rearrange content
            </q-item-section>
          </q-item>

          <q-item
            v-if="hasLinks"
            clickable
            data-cy="add-link-button"
          >
            <q-item-section
              class="short-avatar"
              avatar
            >
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-link"
              />
            </q-item-section>
            <q-item-section class="q-pl-none">
              Add a link to
            </q-item-section>
            <q-item-section side>
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-chevron-right"
              />
            </q-item-section>
            <q-menu
              anchor="top end"
              self="top start"
            >
              <q-item
                v-if="linkComponentItems.length > 0"
                class="q-pa-none"
              >
                <q-item-section class="q-item__label--header q-item__label">
                  By instances:
                </q-item-section>
              </q-item>
              <q-list
                bordered
                separator
              >
                <q-item
                  v-for="(link, index) in linkComponentItems"
                  :key="`link_component_${index}`"
                  v-ripple
                  v-close-popup
                  clickable
                  :data-cy="`link-to-component-${link.target}-button`"
                  @click="sendEvent('linkToComponent', link)"
                >
                  <q-item-section
                    class="short-avatar"
                    avatar
                  >
                    <q-icon
                      size="xs"
                      color="primary"
                      :name="link.icon"
                    />
                  </q-item-section>
                  <q-item-section class="q-pl-none">
                    {{ link.name }} by {{ link.attribute }}
                  </q-item-section>
                </q-item>
                <q-separator
                  v-if="linkDefinitionItems.length > 0 && linkComponentItems.length > 0"
                  class="double-separator"
                  spaced
                />
                <q-item
                  v-if="linkDefinitionItems.length > 0"
                  class="q-pa-none"
                >
                  <q-item-section class="q-item__label--header q-item__label">
                    By components:
                  </q-item-section>
                </q-item>
                <q-item
                  v-for="(link, index) in linkDefinitionItems"
                  :key="`link_definition_${index}`"
                  v-ripple
                  v-close-popup
                  clickable
                  :data-cy="`link-to-definition-${link.componentDefinition.type}-button`"
                  @click="sendEvent('link-to-definition', link)"
                >
                  <q-item-section
                    class="short-avatar"
                    avatar
                  >
                    <q-icon
                      size="xs"
                      color="primary"
                      :name="link.icon"
                    />
                  </q-item-section>
                  <q-item-section class="q-pl-none">
                    {{ link.name }} by {{ link.attribute }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>

          <q-item
            v-if="isContainer"
            clickable
            data-cy="add-in-container-button"
          >
            <q-item-section
              class="short-avatar"
              avatar
            >
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-square-plus"
              />
            </q-item-section>
            <q-item-section class="q-pl-none">
              Add in container
            </q-item-section>
            <q-item-section side>
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-chevron-right"
              />
            </q-item-section>
            <q-menu
              anchor="top end"
              self="top start"
            >
              <q-list
                bordered
                separator
              >
                <q-item
                  v-for="(child, index) in children"
                  :key="`container_component_${index}`"
                  v-ripple
                  v-close-popup
                  clickable
                  :data-cy="`add-component-to-container-${child.definition.type}-button`"
                  @click="sendEvent('addComponentToContainer', child)"
                >
                  <q-item-section
                    class="short-avatar"
                    avatar
                  >
                    <q-icon
                      size="xs"
                      color="primary"
                      :name="child.icon"
                    />
                  </q-item-section>
                  <q-item-section class="q-pl-none">
                    {{ child.name }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>

          <q-item
            v-ripple
            v-close-popup
            clickable
            data-cy="delete-button"
            @click="sendEvent('delete')"
          >
            <q-item-section
              class="short-avatar"
              avatar
            >
              <q-icon
                size="xs"
                color="primary"
                name="fa-solid fa-trash-can"
              />
            </q-item-section>
            <q-item-section class="q-pl-none">
              Delete
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import DialogEvent from 'src/composables/events/DialogEvent';
import PluginEvent from 'src/composables/events/PluginEvent';
import { getPluginByName } from 'src/composables/PluginManager';

const props = defineProps({
  dialogKey: {
    type: String,
    required: true,
  },
});
const show = ref(false);
const dialogStyle = ref({});
const id = ref(null);
const isContainer = ref(false);
const hasLinks = ref(false);
const linkComponentItems = ref([]);
const linkDefinitionItems = ref([]);
const children = ref([]);
let dialogEventSubscription;

/**
 * Generate link list to display it in menu.
 * @param {object} plugin - Current plugin to retrieve link information.
 */
function generateLinks(plugin) {
  const component = plugin.data.getComponentById(id.value);
  const componentLinks = [];
  const definitionLinks = [];

  plugin.data.definitions.links
    .filter((definition) => definition.sourceRef === component.definition.type)
    .forEach((linkDefinition) => {
      const componentDefinition = plugin.data.definitions.components
        .find(({ type }) => type === linkDefinition.targetRef);

      definitionLinks.push({
        name: componentDefinition.displayName || componentDefinition.type,
        icon: `img:/plugins/${plugin.data.name}/icons/${componentDefinition.icon}.svg`,
        attribute: linkDefinition.attributeRef,
        linkDefinition,
        componentDefinition,
      });

      plugin.data.components
        .filter((target) => target.definition.type === linkDefinition.targetRef)
        .forEach((target) => {
          componentLinks.push({
            name: target.id,
            icon: `img:/plugins/${plugin.data.name}/icons/${target.definition.icon}.svg`,
            attribute: linkDefinition.attributeRef,
            linkDefinition,
            target: target.id,
          });
        });
    });

  linkComponentItems.value = componentLinks;
  linkDefinitionItems.value = definitionLinks;
  hasLinks.value = definitionLinks.length + componentLinks.length > 0;
}

/**
 * Generate component list to display it in menu.
 * @param {object} plugin - Current plugin to retrieve component information.
 */
function generateContainerChilds(plugin) {
  const container = plugin.data.getComponentById(id.value);

  children.value = container.definition.childrenTypes
    .map((type) => plugin.data.definitions.components
      .find((definition) => definition.type === type))
    .map((definition) => ({
      name: definition.displayName || definition.type,
      icon: `img:/plugins/${plugin.data.name}/icons/${definition.icon}.svg`,
      definition,
    }));
}

/**
 * Open or close dialog.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Dialog key.
 * @param {string} event.type - Action type, 'open' or 'close'.
 * @param {string} event.event - Mouse event.
 * @param {string} event.pluginName - Name of current plugin.
 */
function onDialogEvent({
  key,
  type,
  event,
  pluginName,
}) {
  if (key !== props.dialogKey) {
    return;
  }

  if (type === 'close') {
    show.value = false;
    return;
  }

  const plugin = getPluginByName(pluginName);

  [id.value] = event.components;
  isContainer.value = plugin.data.getComponentById(id.value).definition.isContainer;
  dialogStyle.value.left = `${event.data.clientX}px`;
  dialogStyle.value.top = `${event.data.clientY}px`;
  generateLinks(plugin);
  if (isContainer.value) {
    generateContainerChilds(plugin);
  }
  show.value = true;
}

/**
 * Send event of user action.
 * @param {string} type - Action type.
 * @param {object} data - Link or component data.
 */
function sendEvent(type, data) {
  show.value = false;
  PluginEvent.RequestEvent.next({
    type,
    id: id.value,
    data,
  });
}

onMounted(() => {
  dialogEventSubscription = DialogEvent.subscribe(onDialogEvent);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>

<style lang="scss">
.component-menu-dialog .q-dialog__inner {
  align-items: start;
  justify-content: start;
  padding: 0;
}
.component-menu-dialog .q-dialog__backdrop {
  background-color: rgba(0, 0, 0, 0);
}
.short-avatar {
  min-width: 30px!important;
}
.double-separator {
  padding-top: 2px;
  border-top: 1px solid $primary;
  border-bottom: 1px solid $primary;
  background: transparent;
}
</style>
