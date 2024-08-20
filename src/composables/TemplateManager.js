import { templateLibraryApiClient } from 'boot/axios';
import {
  ComponentDefinition,
  FileInput,
} from '@ditrit/leto-modelizer-plugin-core';
import nunjucks from 'nunjucks';
import { randomHexString } from 'src/composables/Random';

/**
 * Get a remote file's content.
 * @param {string} filePath - Path of the file.
 * @param {string} responseType - Response type.
 * @returns {Promise<object>} Promise with resources on success otherwise an error.
 */
export async function getTemplateFileByPath(filePath, responseType = 'json') {
  return templateLibraryApiClient.get(filePath, {
    headers: {
      Accept: '*',
    },
    responseType,
  });
}

/**
 * Get list of templates from a remote file.
 * @returns {Promise<Array>} Promise with templates on success otherwise an error.
 */
export function getRemoteTemplates() {
  if (process.env.TEMPLATE_LIBRARY_BASE_URL) {
    return getTemplateFileByPath('index.json')
      .then((result) => result.data.templates);
  }
  return Promise.resolve([]);
}

/**
 * Filter and return only templates related to a provided type.
 * PluginName is only required if type equals `component`.
 * @param {string} type - Type of template.
 * @param {string} [pluginName] - Name of plugin.
 * @returns {Promise<object[]>} Promise with Filtered templates on success otherwise an error.
 */
export async function getTemplatesByType(type, pluginName = '') {
  const templates = await getRemoteTemplates();
  let filteredTemplates = [];

  if (type === 'component') {
    filteredTemplates = templates
      .filter((template) => (template.type === type && template.plugin === pluginName));
  } else {
    filteredTemplates = templates
      .filter((template) => (template.type === type));
  }

  return filteredTemplates.map((template) => {
    const definition = new ComponentDefinition({
      type: template.name,
      icon: `/template-library/templates/${template.key}/icon.svg`,
    });

    return {
      ...definition,
      isTemplate: true,
      plugin: template.plugin,
      plugins: template.plugins,
      files: template.files,
      key: template.key,
      url: template.url,
      description: template.description,
      models: template.models,
      schemas: template.schemas || [],
    };
  });
}

/**
 * Generate template content with nunjucks.
 * @param {string} content - Template of content.
 * @returns {string} Generated content.
 */
export function generateTemplate(content) {
  return nunjucks.renderString(content, {
    generateId: (prefix) => `${prefix || ''}${randomHexString(6)}`,
  });
}

/**
 * Get files of the templates.
 * @param {string} path - Model path (Plugin name & model name).
 * @param {object} templateDefinition - Definition of the template.
 * @returns {Promise<FileInput[]>} Promise with a FileInput array on success otherwise an error.
 */
export async function getTemplateFiles(path, templateDefinition) {
  return Promise.all(
    templateDefinition.files.map(
      (file) => getTemplateFileByPath(`templates/${templateDefinition.key}/${file}`)
        .then(({ data }) => new FileInput({
          path: path ? `${path}/${file}` : file,
          content: generateTemplate(data),
        })),
    ),
  );
}
