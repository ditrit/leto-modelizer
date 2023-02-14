import { templateLibraryApiClient } from 'boot/axios';
import { ComponentDefinition } from 'leto-modelizer-plugin-core';
import nunjucks from 'nunjucks';
import { randomHexString } from 'src/composables/Random';

/**
 * Get a remote file's content.
 * @param {String} filePath - Path of the file.
 * @return {Promise<Object>} Promise with resources on success otherwise an error.
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
 * @return {Promise<Array>} Promise with templates on success otherwise an error.
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
 * @param {String} type - Type of template.
 * @param {String} [pluginName=''] - Name of plugin.
 * @return {Array<Object>} Filtered templates.
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
      files: template.files,
      key: template.key,
      url: template.url,
      description: template.description,
      models: template.models,
    };
  });
}

/**
 * Generate template content with nunjucks.
 * @param {String} content - Template of content.
 * @return {String} Generated content.
 */
export function generateTemplate(content) {
  return nunjucks.renderString(content, {
    generateId: (prefix) => `${prefix || ''}${randomHexString(6)}`,
  });
}
