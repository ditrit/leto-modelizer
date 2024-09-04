import { prepareApiRequest } from 'src/boot/axios';

/**
 * Generate diagrams using Leto AI proxy.
 * It posts a request to the proxy and returns a json response composed of an
 * array with each item being a diagram (a name and a content).
 * @param {string} plugin - name of the plugin
 * @param {string} description - description of the diagram
 * @returns {Promise<object>} Promise with the diagram information on success
 * otherwise an error.
 */
export async function generateDiagram(plugin, description) {
  const api = await prepareApiRequest();

  return api.post('/ai/generate', {
    plugin,
    description,
    type: 'diagram',
  }, { timeout: 300000 });
}
