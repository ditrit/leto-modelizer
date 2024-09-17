import { api } from 'boot/axios';
import { getTemplatesByType } from 'src/composables/TemplateManager';

/**
 * Filter and return only API templates related to a provided type.
 * @param {string} type - Type of template you want to get. PROJECT | COMPONENT | MODEL
 * @returns {Promise<object>}
 * otherwise an error.
 */
export async function getAPITemplatesByType(type) {
  return api.get(`/libraries/templates?type=${type}`).then((data) => data.content);
}

/**
 * Get "project" templates.
 * @returns {Array} return array of project templates.
 */
export async function getProjectTemplates() {
  if (!process.env.HAS_BACKEND) {
    return getTemplatesByType('project');
  }

  return getAPITemplatesByType('PROJECT');
}
