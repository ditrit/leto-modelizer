import { api, prepareQueryParameters, templateLibraryApiClient } from 'boot/axios';
import { FileInput } from '@ditrit/leto-modelizer-plugin-core';
import nunjucks from 'nunjucks';
import { randomHexString } from 'src/composables/Random';

/**
 * Retrieve templates by type from API.
 * @param {string} type - Type of template.
 * @param {object} filters - Object that contains filters for query parameters.
 * @returns {Promise<object>} Response that contains Templates.
 */
async function getTemplatesFromAPI(type, filters) {
  const queryParameters = prepareQueryParameters({
    ...filters,
    plugin: '',
    plugins: `lk_*${filters.plugin}*`,
    order: 'name',
    sort: 'asc',
    type,
  });

  return api.get(`/libraries/templates${queryParameters}`)
    .then(({ data }) => data);
}

/**
 * Retrieve templates by type from URL.
 * @param {object} env - Environment variables.
 * @param {string} env.TEMPLATE_LIBRARY_BASE_URL - URL library index.
 * @param {string} type - Type of template.
 * @param {object} filters - Object that contains filters for query parameters.
 * @returns {Promise<object>} Response that contains Templates.
 */
async function getTemplatesFromUrl(env, type, filters) {
  if (!env.TEMPLATE_LIBRARY_BASE_URL) {
    return {
      content: [],
      pageable: {
        pageNumber: 0,
        pageSize: filters.count,
      },
      totalElements: 0,
    };
  }

  return templateLibraryApiClient.get('index.json', {
    headers: {
      Accept: '*',
    },
    responseType: 'json',
  }).then(({ data }) => {
    const currentPage = filters.page >= Math.ceil(data.templates.length / filters.count)
      ? filters.page - 1
      : filters.page;
    const filteredTemplates = data.templates
      .filter((template) => (template.type === type))
      .filter((template) => (!filters.name ? true : template.name.indexOf(filters.name) !== -1))
      .filter((template) => (filters.plugin.length === 0
        ? true : template.plugin === filters.plugin))
      .map((template) => ({
        ...template,
        icon: `/template-library/${template.basePath}${template.icon}`,
        isTemplate: true,
        plugins: template.plugins || [template.plugin],
        schemas: template.schemas || [],
      }));
    const totalElements = filteredTemplates.length;

    return {
      content: filteredTemplates
        .slice(currentPage * filters.count, (currentPage + 1) * filters.count),
      pageable: {
        pageNumber: currentPage,
        pageSize: filters.count,
      },
      totalElements,
    };
  });
}

/**
 * Get templates by types.
 * @param {object} env - Environment variables.
 * @param {string} env.HAS_BACKEND - Indicate if backend is setup.
 * @param {string} env.TEMPLATE_LIBRARY_BASE_URL - URL library index.
 * @param {string} type - Type of template.
 * @param {object} filters - Object that contains filters for query parameters.
 * @returns {Promise<object>} Response that contains Templates.
 */
export async function getTemplatesByType(env, type, filters) {
  if (!env.HAS_BACKEND) {
    return getTemplatesFromUrl(env, type, filters);
  }

  return getTemplatesFromAPI(type, {
    ...filters,
    name: filters.name.length > 0 ? `lk_*${filters.name}*` : filters.name,
  });
}

/**
 * Render template content with nunjucks.
 * @param {string} content - Content to render.
 * @returns {string} Rendered content.
 */
export function generateTemplate(content) {
  return nunjucks.renderString(content, {
    generateId: (prefix) => `${prefix || ''}${randomHexString(6)}`,
  });
}

/**
 * Retrieve content of template file.
 * @param {object} env - Environment variables.
 * @param {string} env.HAS_BACKEND - Indicate if backend is setup.
 * @param {object} template - Template that contains of file names.
 * @param {number} index - Index of file to get content.
 * @returns {Promise<string>} Content of selected template file.
 */
export async function getTemplateFileContent(env, template, index) {
  if (!env.HAS_BACKEND) {
    return templateLibraryApiClient.get(`${template.basePath}${template.files[index]}`, {
      headers: {
        Accept: '*',
      },
      responseType: 'json',
    }).then(({ data }) => generateTemplate(data));
  }

  return api.get(`/libraries/templates/${template.id}/files/${index}`)
    .then(({ data }) => generateTemplate(data));
}

/**
 * Get all template files.
 * @param {object} env - Environment variables.
 * @param {string} env.HAS_BACKEND - Indicate if backend is setup.
 * @param {object} template - Template that contains of file names.
 * @returns {Promise<FileInput[]>} All templates files.
 */
export async function getTemplateFiles(env, template) {
  return Promise.allSettled(
    template.files.map((file, index) => getTemplateFileContent(env, template, index)
      .then((content) => new FileInput({
        path: file,
        content,
      }))),
  ).then((result) => result.map(({ value }) => value));
}
