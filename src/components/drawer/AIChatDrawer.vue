<template>
  <div
    data-cy="ai-chat-panel"
    class="column full-height full-width"
    style="overflow-x: hidden"
  >
    <div class="row q-px-md justify-between items-center">
      <span class="text-overline q-item__label--header">
        {{ $t('page.modelizer.drawer.aichat.title') }}
      </span>
      <q-btn
        v-close-popup
        icon="fa-solid fa-xmark"
        flat
        round
        dense
        @click="DrawerEvent.next({ type: 'close', key: 'AIChatDrawer' })"
      />
    </div>
    <div
      ref="scrollContainer"
      class="flex-1 q-pa-sm scroll-y"
      style="word-break: break-all;"
    >
      <div class="flex justify-center q-mb-md">
        <q-btn
          v-if="haveMoreMessages"
          color="primary"
          outline
          no-caps
          icon="fa-solid fa-ellipsis"
          :loading="submitting"
          :label="$t('page.modelizer.drawer.aichat.moreMessages')"
          @click="loadMoreMessage"
        >
          <template #loading>
            <q-spinner-dots />
          </template>
        </q-btn>
      </div>

      <template
        v-for="(message, index) in messages"
        :key="`message_${index}`"
      >
        <q-chat-message
          v-if="message.isMine"
          :text="[message.text]"
          sent
          bg-color="secondary"
          text-color="white"
        />
        <q-chat-message
          v-else
          text-html
          :text="[message.text]"
          bg-color="grey-3"
          text-color="black"
        />
      </template>
      <q-chat-message
        v-if="lastAIMessage"
        text-html
        :text="[lastAIMessage.text]"
        bg-color="grey-3"
        text-color="black"
      >
        <template #stamp>
          <q-spinner-bars v-if="submitting" />
        </template>
      </q-chat-message>
    </div>
    <div class="row full-width q-pa-sm justify-center items-center">
      <q-btn
        color="primary"
        round
        outline
        icon="fa-solid fa-gear"
        data-cy=""
      >
        <q-menu auto-close>
          <q-list>
            <q-item-label header>
              <q-icon
                name="fa-solid fa-gear"
                color="primary"
              />
              {{ $t('page.modelizer.drawer.aichat.settings.title') }}
            </q-item-label>
            <q-item>
              <q-item-section avatar>
                <q-icon
                  name="fa-solid fa-marker"
                  color="primary"
                  size="xs"
                />
              </q-item-section>
              <q-item-section>
                {{ $t('page.modelizer.drawer.aichat.settings.typingEffect') }}
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  v-model="progressiveTyping"
                  color="primary"
                  @update:model-value="toggleTypingStyle"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-btn
                  color="negative"
                  no-caps
                  icon="fa-solid fa-trash"
                  :loading="submitting"
                  :label="$t('page.modelizer.drawer.aichat.settings.delete')"
                  @click="deleteConversation"
                >
                  <template #loading>
                    <q-spinner-bars />
                  </template>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <q-input
        v-model="text"
        autogrow
        rounded
        outlined
        class="flex-1 q-mx-sm"
        color="primary"
        :placeholder="$t('page.modelizer.drawer.aichat.sendMessage')"
        @keyup.enter="submit"
      />
      <q-btn
        color="primary"
        round
        icon="fa-solid fa-arrow-up"
        :loading="submitting"
        @click="submit"
      >
        <template #loading>
          <q-spinner-bars />
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  nextTick,
  onMounted,
  onUnmounted,
} from 'vue';
import DrawerEvent from 'src/composables/events/DrawerEvent';
import {
  manageConversation,
  retrieveMessages,
  sendMessage,
} from 'src/services/AIService';
import { getDiagramFiles, getPluginByName } from 'src/composables/PluginManager';
import DialogEvent from 'src/composables/events/DialogEvent';

const props = defineProps({
  projectName: {
    type: String,
    default: '',
  },
  diagramPath: {
    type: String,
    default: '',
  },
  pluginName: {
    type: String,
    default: '',
  },
});
const scrollContainer = ref(null);
const text = ref('');
const submitting = ref(false);
const messages = ref([]);
const lastAIMessage = ref(null);
const progressiveTyping = ref(false);
const haveMoreMessages = ref(false);

let oldestDate = null;
let dialogEventSubscription = null;

/**
 * Make scroll to bottom in div that contains all messages.
 */
function scrollToBottom() {
  nextTick().then(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
}

/**
 * Animate message, to make letters appear one by one.
 * @param {string} message - Message to animate.
 */
function startTypingEffect(message) {
  if (message.length === 0) {
    return;
  }

  if (!progressiveTyping.value) {
    lastAIMessage.value.text += message;
    scrollToBottom();
    return;
  }

  lastAIMessage.value.text += message.charAt(0);

  scrollToBottom();
  setTimeout(() => {
    startTypingEffect(message.slice(1));
  }, 25);
}

/**
 * Send message to AI.
 * @param {object} event - Event to get if validation is not shift enter.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function submit(event) {
  if (event.shiftKey) {
    return;
  }

  const formattedText = text.value.trim();

  if (submitting.value || formattedText.length === 0) {
    return;
  }

  submitting.value = true;

  if (lastAIMessage.value) {
    messages.value.push(lastAIMessage.value);
    lastAIMessage.value = null;
  }

  messages.value.push({
    isMine: true,
    text: formattedText,
  });

  text.value = '';

  scrollToBottom();

  const plugin = getPluginByName(props.pluginName);
  const files = await getDiagramFiles(props.projectName, plugin, props.diagramPath);

  lastAIMessage.value = {
    isMine: false,
    text: '',
  };

  const aiConversation = await manageConversation(
    props.projectName,
    props.diagramPath,
    props.pluginName,
    files,
  );
  const aiMessage = await sendMessage(aiConversation.id, props.pluginName, formattedText);

  submitting.value = false;

  startTypingEffect(aiMessage.message);
}

/**
 * Save in localstorage user typing preferences.
 */
function toggleTypingStyle() {
  localStorage.setItem('ai-typing-speed', progressiveTyping.value ? 'progressive' : 'instant');
}

/**
 * Load more message from history.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function loadMoreMessage() {
  submitting.value = true;

  return retrieveMessages(
    props.projectName,
    props.diagramPath,
    props.pluginName,
    oldestDate,
  ).then((data) => {
    oldestDate = data.content[0]?.updateDate || null;
    haveMoreMessages.value = data.totalPages > 1;

    const array = [];

    data.content.forEach((item) => {
      array.push({
        isMine: item.isUser,
        text: item.message,
      });
    });
    messages.value.forEach((item) => array.push(item));

    messages.value = array;
  }).finally(() => {
    submitting.value = false;
  });
}

/**
 * Clear conversation and delete all messages.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function deleteConversation() {
  DialogEvent.next({
    key: 'DeleteAIConversation',
    type: 'open',
    projectName: props.projectName,
    diagramPath: props.diagramPath,
    pluginName: props.pluginName,
  });
}

/**
 * Clean variables after deleting conversation.
 * @param {object} event - Dialog event.
 * @param {string} event.key - Event key.
 * @param {string} event.type - Open or close.
 */
function cleanVariables({ key, type }) {
  if (type === 'close' && key === 'DeleteAIConversation') {
    messages.value = [];
    oldestDate = null;
    haveMoreMessages.value = false;
    lastAIMessage.value = null;
  }
}

onMounted(() => {
  progressiveTyping.value = localStorage.getItem('ai-typing-speed') === 'progressive';
  loadMoreMessage().then(scrollToBottom);
  dialogEventSubscription = DialogEvent.subscribe(cleanVariables);
});

onUnmounted(() => {
  dialogEventSubscription.unsubscribe();
});
</script>
