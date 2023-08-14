/**
 * Retrieve content of a file.
 * @param {string} path - File path
 * @returns {Promise<string>} Promise with file content on success otherwise an error.
 */
export async function readTextFile(path) {
  return new Promise((resolve, reject) => {
    const rawFile = new XMLHttpRequest();
    rawFile.open('GET', path);
    rawFile.onload = () => {
      if (rawFile.status === 200) {
        resolve(rawFile.responseText);
      } else {
        reject(rawFile.statusText);
      }
    };
    rawFile.onerror = () => reject(rawFile.statusText);
    rawFile.send(null);
  });
}
