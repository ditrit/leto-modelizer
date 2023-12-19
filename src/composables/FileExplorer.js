import { isParsableFile } from 'src/composables/PluginManager';

/**
 * Create and add a new folder.
 * @param {string} id - Absolute path of the new folder.
 * @param {object} parentFolder - Parent folder.
 * @param {string} name - Name of the new folder.
 * @param {string} rootFolder - Name of the root folder.
 * @returns {object} The created folder.
 */
export function createFolder(id, parentFolder, name, rootFolder) {
  const newFolder = {
    id,
    icon: 'fa-solid fa-folder',
    label: name,
    children: [],
    isFolder: true,
    isRootFolder: rootFolder === id,
    hasParsableFiles: false,
  };

  parentFolder.children.push(newFolder);

  return newFolder;
}

/**
 * Create and add a new file.
 * @param {FileInformation} fileInformation - Absolute path of the new file.
 * @param {object} parentFolder - Parent folder.
 * @param {string} name - Name of the new file.
 */
export function createFile(fileInformation, parentFolder, name) {
  if (name === '__empty__') {
    return;
  }
  const isParsable = isParsableFile(fileInformation);

  const newFile = {
    id: fileInformation.path,
    icon: 'fa-regular fa-file',
    label: name,
    isFolder: false,
    information: fileInformation,
    isParsable,
  };

  parentFolder.children.push(newFile);
}

/**
 * Update information of the file node corresponding to the fileStatus.
 * `parentNode` should be the node of the first folder mentionned in the fileStatus path.
 * @param {object} parentNode - Node of the tree containing children.
 * @param {object} fileStatus - File status information.
 * @param {number} index - Index of the part to check in the path.
 */
export function updateFileInformation(parentNode, fileStatus, index = 0) {
  // We need to compare the label to each element of splitPath so
  // .slice(1) is needed to remove the root folder of the path.
  const splitPath = fileStatus.path.split('/').slice(1);
  const item = parentNode.children.find((child) => child.label === splitPath[index]);

  if (!item) {
    return;
  }

  if (splitPath.length === index + 1) {
    item.information = fileStatus;
  } else {
    updateFileInformation(item, fileStatus, index + 1);
  }
}

/**
 * Sort elements by alphabetic order and sort to display folders before files.
 * @param {Array} elements - Tree folders.
 * @returns {Array} - Sorted Tree.
 */
function sortElementsInFolder(elements) {
  return elements.sort((x, y) => {
    if (x.isFolder && !y.isFolder) {
      return -1;
    }
    if (!x.isFolder && y.isFolder) {
      return 1;
    }
    return (y.label.toUpperCase() > x.label.toUpperCase() ? -1 : 1);
  });
}

/**
 * Sort Tree root and nested elements.
 * @param {Array} elements - Tree folders.
 * @returns {Array} - Sorted Tree.
 */
export function sortTreeElements(elements) {
  sortElementsInFolder(elements);
  elements.filter((element) => element.children && element.children.length > 0)
    .forEach((element) => sortTreeElements(element.children));
  return elements;
}

/**
 * Create file and folder element to build tree based upon path.
 * @param {FileInformation} fileInformation - Absolute path of tree element.
 * @param {object} parentFolder - Parent folder of element to create.
 * @param {string} path - Path of the tree element.
 * @param {string} rootFolder - Name of the root folder.
 */
function createTreeElements(fileInformation, parentFolder, path, rootFolder) {
  const splittedPath = path.split('/').filter(Boolean);

  if (splittedPath.length === 1) {
    createFile(fileInformation, parentFolder, splittedPath[0]);
  } else {
    const folderId = `${fileInformation.path
      .slice(0, (path.length * -1) + splittedPath[0].length)}`;
    const folder = parentFolder.children.find((child) => child.label === splittedPath[0])
      || createFolder(folderId, parentFolder, splittedPath[0], rootFolder);

    createTreeElements(fileInformation, folder, splittedPath.slice(1).join('/'), rootFolder);
    folder.hasParsableFiles = folder.children
      .some((child) => child.hasParsableFiles || child.isParsable);
  }
}

/**
 * Convert fileInformation inputs to the Object required to display Quasar Tree Component.
 * @param {string} projectId - local project id.
 * @param {FileInformation[]} fileInformationArray - Array to convert for Quasar Tree Component.
 * Example: [{path: 'home/folder/file1.tf'}, {path: 'home/file2.tf'}].
 * @returns {Array} - Array of nodes that designates the tree structure of Quasar Tree Component.
 * @see https://quasar.dev/vue-components/tree
 */
export function getTree(projectId, fileInformationArray) {
  const rootFolder = {
    id: projectId,
    icon: 'fa-solid fa-folder',
    label: projectId,
    isFolder: true,
    isRootFolder: true,
    hasParsableFiles: false,
    children: [],
  };

  if (fileInformationArray.length === 0) {
    return [rootFolder];
  }

  fileInformationArray.forEach((fileInformation) => {
    createTreeElements(fileInformation, rootFolder, fileInformation.path, projectId);
  });

  return [...sortTreeElements(rootFolder.children)];
}
