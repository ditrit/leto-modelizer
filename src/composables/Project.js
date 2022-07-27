import { randomHexString } from 'src/composables/Random';

/**
 * Create a project with generated id.
 *
 * @returns {{Object}} Project object with generated id.
 */
export function createProject() {
  return { id: `project-${randomHexString(8)}` };
}
