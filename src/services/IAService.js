import { prepareApiRequest } from 'boot/axios';

export async function createDiagram(plugin, description) {
  const api = await prepareApiRequest();

  return api.post('/ia', {
    plugin,
    description,
    type: 'diagram',
  });
}
