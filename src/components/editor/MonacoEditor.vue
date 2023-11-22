<template>
  <div
    class="monaco-editor"
    data-cy="monaco-editor"
  >
    <div
      id="container"
      ref="container"
    />
  </div>
</template>

<script setup>
import {
  writeProjectFile,
  readProjectFile,
  exists,
} from 'src/composables/Project';
import { getStatus } from 'src/composables/Git';
import {
  onBeforeMount,
  onMounted,
  onUpdated,
  onUnmounted,
  ref,
} from 'vue';
import FileEvent from 'src/composables/events/FileEvent';
import GitEvent from 'src/composables/events/GitEvent';
import { getPlugins } from 'src/composables/PluginManager';
import Languages from 'assets/editor/languages';

const props = defineProps({
  projectName: {
    type: String,
    required: true,
  },
  file: {
    type: Object,
    required: true,
  },
});

const container = ref(null);
let monaco;
let editor;
let timer;
let checkoutSubscription;
let addRemoteSubscription;
let pullSubscription;

/**
 * Update file content on fs and emit UpdateEditorContentEvent.
 */
async function updateFile() {
  const file = {
    ...props.file,
    path: props.file.id,
    content: editor.getValue(),
  };

  await writeProjectFile(props.projectName, file);

  const [fileStatus] = await getStatus(
    props.projectName,
    [file.id],
    (path) => path === file.id,
  );

  FileEvent.UpdateEditorContentEvent.next(fileStatus);
}

/**
 * Read file on fs to get its content.
 * @returns {Promise<string>} Promise with file's content on success otherwise error.
 */
async function getFileContent() {
  return readProjectFile(props.projectName, { path: props.file.id })
    .then((fileInput) => fileInput.content || '');
}

/**
 * Retrieve language from file path for Monaco editor.
 * If language configuration comes from a plugin, set the Monaco configuration.
 * Otherwise, use default language configuration if it exists.
 * @param {string} path - File path.
 * @returns {string} Associated language.
 */
function initMonacoLanguages(path) {
  const plugin = getPlugins().find((p) => p.isParsable({ path }));

  if (plugin?.configuration.editor.syntax) {
    const { syntax } = plugin.configuration.editor;

    monaco.languages.register(syntax.languageSettings);
    monaco.languages.setLanguageConfiguration(syntax.name, syntax.languageConfiguration);
    monaco.languages.setMonarchTokensProvider(syntax.name, syntax.tokenProvider);

    return syntax.name;
  }

  return Languages.find(({ regex }) => new RegExp(regex).test(path))?.name || null;
}

/**
 * Delays the given function until after the stated delay has passed
 * since the last time this `debounce` function was called.
 * @param {Function} functionRef - A function to be called after the delay expires.
 * @param {number} delay - Time in milliseconds for which the calls are to be delayed.
 */
function debounce(functionRef, delay) {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    functionRef();
    clearTimeout(timer);
    timer = null;
  }, delay);
}

/**
 * Setup monaco editor.
 * Register plugin language syntax colorizer.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function createEditor() {
  const value = await getFileContent();
  const language = initMonacoLanguages(props.file.id);

  editor = monaco.editor.create(container.value, { value, language });

  editor.onDidChangeModelContent(() => {
    debounce(updateFile, 1000);
  });
}

/**
 * Update default editor layout size.
 * Needed when viewType is firstly set to 'model' and ModelizerTextView is hidden,
 * meaning 'container' height and width are set to 0.
 */
async function updateEditorLayout() {
  // For some unknown reasons, editor is null, but only appears on cypress tests.
  // But to avoid potential bugs, we recreate editor if null.
  if (!editor) {
    await createEditor();
  }
  editor.layout({
    height: container.value.offsetHeight,
    width: container.value.offsetWidth,
  });
}

/**
 * Get file content and update editor value.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
async function updateEditorContent() {
  const isExisting = await exists(`${props.projectName}/${props.file.id}`);

  if (isExisting) {
    const value = await getFileContent();

    editor.setValue(value);
  }
}

onBeforeMount(async () => {
  monaco = await import('monaco-editor');

  if (!editor) {
    await createEditor();
  }
});

onMounted(() => {
  checkoutSubscription = GitEvent.CheckoutEvent.subscribe(() => {
    updateEditorContent();
  });
  addRemoteSubscription = GitEvent.AddRemoteEvent.subscribe(() => {
    updateEditorContent();
  });
  pullSubscription = GitEvent.PullEvent.subscribe(() => {
    updateEditorContent();
  });
});

onUpdated(async () => {
  await updateEditorLayout();
});

onUnmounted(() => {
  checkoutSubscription.unsubscribe();
  addRemoteSubscription.unsubscribe();
  pullSubscription.unsubscribe();
});
</script>

<style lang="scss" scoped>
.monaco-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 1.5rem;
  //132px is the combined navbar + file tabs height
  height: calc(100vh - 132px - 1.5rem);

  #container {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
}
</style>
