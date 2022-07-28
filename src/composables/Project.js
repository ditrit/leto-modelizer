import { randomHexString } from 'src/composables/Random';

export const PROJECT_STORAGE_KEY = 'projects';

/**
 * Represent a project object.
 *
 * @typedef {Object} Project
 * @property {string} id project id
 */

/**
 * Create a project with generated id.
 *
 * @returns {Project} Project object with generated id.
 */
export function createProjectTemplate() {
  return { id: `project-${randomHexString(8)}` };
}

/**
 * Get a map of all projects.
 *
 * @return {Object} Object that contains all project id as key and associated project as value
 */
export function getProjects() {
  const lsProjects = localStorage.getItem(PROJECT_STORAGE_KEY);
  return JSON.parse(lsProjects || '{}');
}

/**
 * Get one project by its ID.
 *
 * @param {string} projectId
 * @returns {?Project}
 */
export function getProjectById(projectId) {
  const projects = getProjects();
  return projects[projectId];
}

/**
 * Save the project state.
 *
 * @param {Project} project
 */
export function saveProject(project) {
  const projects = getProjects();
  projects[project.id] = project;
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Clear one project by ID.
 *
 * @param {string} projectId
 */
export function deleteProjectById(projectId) {
  const projects = getProjects();
  if (projects[projectId]) {
    delete projects[projectId];
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  }
}

/**
 * Delete all saved projects.
 */
export function deleteAllProjects() {
  localStorage.setItem(PROJECT_STORAGE_KEY, '{}');
}
