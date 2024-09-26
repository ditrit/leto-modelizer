import { makeFilterRequest, prepareApiRequest, prepareQueryParameters } from 'src/boot/axios';
import { getUserAIConversations } from 'src/services/UserService';
import CryptoJS from 'crypto-js';
import pako from 'pako';

const options = { timeout: 300000 };

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
  }, options);
}

/**
 * Calculate the checksum of an array of objects with path and content properties
 * @param {Array} files - Array of objects with 'path' and 'content' properties
 * @returns {string} - The computed checksum (SHA-256 hash)
 */
function calculateChecksum(files) {
  const combinedContent = files.map((file) => `${file.path}${file.content}`).join('');

  return CryptoJS.SHA256(combinedContent).toString(CryptoJS.enc.Hex);
}

/**
 * Uncompress Base64 GZIP message.
 * @param {Uint8Array} message - Base64 GZIP message.
 * @returns {string} Uncompressed message.
 */
function uncompress(message) {
  const binaryString = atob(message);
  const len = binaryString.length;
  const compressedData = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    compressedData[i] = binaryString.charCodeAt(i);
  }

  return pako.ungzip(compressedData, { to: 'string' });
}

/**
 * Manage conversation, if conversation not exists created it and send files.
 * Otherwise, if files are changed, update files.
 * @param {string} project - Project name.
 * @param {string} diagram - Diagram path.
 * @param {string} plugin - Plugin name.
 * @param {FileInput[]} files - Diagram files.
 * @returns {Promise<object>} Return conversation object with id and other properties.
 */
export async function manageConversation(project, diagram, plugin, files) {
  const api = await prepareApiRequest();
  const checksum = calculateChecksum(files);
  const { content } = await getUserAIConversations({ key: `${project}/${diagram}/${plugin}` });

  if (content.length === 0) {
    return api.post('/ai/conversations', {
      project,
      diagram,
      plugin,
      checksum,
      files,
    }, options);
  }

  const aiConversation = content[0];

  if (aiConversation.checksum !== checksum) {
    return api.put(`/ai/conversations/${aiConversation.id}`, {
      project,
      diagram,
      plugin,
      checksum,
      files,
    }, options);
  }

  return aiConversation;
}

/**
 * Send Message to AI and get its answers.
 * @param {string} conversationId - Id of conversation.
 * @param {string} pluginName - Plugin name.
 * @param {string} message - Message to send.
 * @returns {Promise<object>} Answer of AI.
 */
export async function sendMessage(conversationId, pluginName, message) {
  const api = await prepareApiRequest();

  return api.post(`/ai/conversations/${conversationId}/messages`, { plugin: pluginName, message }, options)
    .then((data) => ({
      ...data,
      message: uncompress(data.message),
    }));
}

/**
 * Format date for server filtering.
 * @param {Date} date - Date to format.
 * @returns {string} Formatted date.
 */
function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milli = String(date.getUTCMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milli}`;
}

/**
 * Retrieve messages of conversation.
 * @param {string} project - Project name.
 * @param {string} diagram - Diagram path.
 * @param {string} plugin - Plugin name.
 * @param {string} date - Date of last loaded message to retrieve older messages.
 * @returns {Promise<object>} Object that contains messages to retrieve.
 */
export async function retrieveMessages(project, diagram, plugin, date = null) {
  const { content } = await getUserAIConversations({ key: `${project}/${diagram}/${plugin}` });

  if (content.length === 0) {
    return {
      content: [],
      totalPages: 0,
    };
  }

  const api = await prepareApiRequest();
  const aiConversation = content[0];
  const formattedDate = formatDate(new Date(date));

  const queryParameters = prepareQueryParameters({
    count: '5',
    page: 0,
    order: 'updateDate',
    sort: 'desc',
    updateDate: !date ? '' : `lt${formattedDate}`,
  });

  return makeFilterRequest(api, `/ai/conversations/${aiConversation.id}/messages${queryParameters}`)
    .then((data) => ({
      ...data,
      content: data.content.map((c) => ({
        ...c,
        message: uncompress(c.message),
      })).reverse(),
    }));
}

/**
 * Delete conversation history.
 * @param {string} project - Project name.
 * @param {string} diagram - Diagram path.
 * @param {string} plugin - Plugin name
 * @returns {Promise<void>} Promise with nothing on success otherwise an error.
 */
export async function deleteConversation(project, diagram, plugin) {
  const { content } = await getUserAIConversations({ key: `${project}/${diagram}/${plugin}` });

  if (content.length === 0) {
    return Promise.reject();
  }

  const api = await prepareApiRequest();

  return api.delete(`/ai/conversations/${content[0].id}`);
}
