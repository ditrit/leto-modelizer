import { prepareApiRequest } from 'boot/axios';

/**
 * Get image by url.
 * @param {string} url - Url of image to retrieve.
 * @returns {Promise<string>} Return a image on success, otherwise an error.
 */
export async function downloadImage(url) {
  const api = await prepareApiRequest();

  return api.get(url, {
    responseType: 'arraybuffer',
  })
    .then((response) => {
      const imageBase64 = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), ''),
      );
      return `data:${response.headers['content-type']};base64,${imageBase64}`;
    });
}

/**
 * Get template icon by id.
 * @param {object} env - Environment variables.
 * @param {string} env.HAS_BACKEND - Indicate if backend is setup.
 * @param {object} template - Template object.
 * @returns {Promise<string>} Return a template icon on success, otherwise an error.
 */
export async function getTemplateIcon(env, template) {
  if (!env.HAS_BACKEND) {
    return template.icon;
  }

  return downloadImage(`/libraries/templates/${template.id}/icon`);
}

/**
 * Get template schema by template id and its index.
 * @param {object} env - Environment variables.
 * @param {string} env.HAS_BACKEND - Indicate if backend is setup.
 * @param {object} template - Template object.
 * @param {number} index - Template schema index in schema array.
 * @returns {Promise<string>} Return a template schema on success, otherwise an error.
 */
export async function getTemplateSchema(env, template, index) {
  if (!env.HAS_BACKEND) {
    return `/template-library/${template.basePath}${template.schemas[index]}`;
  }

  return downloadImage(`/libraries/templates/${template.id}/schemas/${index}`);
}
