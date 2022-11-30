import { isParsableFile } from 'src/composables/PluginManager';

/**
 * Create and add a new folder.
 * @param {String} id - Absolute path of the new folder.
 * @param {Object} parentFolder - Parent folder.
 * @param {String} name - Name of the new folder.
 * @return {Object} The created folder.
 */
export function createFolder(id, parentFolder, name) {
  const newFolder = {
    id,
    icon: 'fa-solid fa-folder',
    label: name,
    children: [],
    isFolder: true,
    hasParsableFiles: false,
  };

  parentFolder.children.push(newFolder);

  return newFolder;
}

/**
 * Create and add a new file.
 * @param {FileInformation} fileInformation - Absolute path of the new file.
 * @param {Object} parentFolder - Parent folder.
 * @param {String} name - Name of the new file.
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
 * @param {FileInformation} fileInformation- Absolute path of tree element.
 * @param {Object} parentFolder - Parent folder of element to create.
 * @param {String} path - Path of the tree element.
 */
function createTreeElements(fileInformation, parentFolder, path) {
  const splittedPath = path.split('/').filter(Boolean);

  if (splittedPath.length === 1) {
    createFile(fileInformation, parentFolder, splittedPath[0]);
  } else {
    const folderId = `${fileInformation.path
      .slice(0, (path.length * -1) + splittedPath[0].length)}`;
    const folder = parentFolder.children.find((child) => child.label === splittedPath[0])
      || createFolder(folderId, parentFolder, splittedPath[0]);

    createTreeElements(fileInformation, folder, splittedPath.slice(1).join('/'));
    folder.hasParsableFiles = folder.children
      .some((child) => child.hasParsableFiles || child.isParsable);
  }
}

/**
 * Convert fileInformation inputs to the Object required to display Quasar Tree Component.
 * @param {String} projectId - local project id.
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
    children: [],
  };

  fileInformationArray.forEach((fileInformation) => {
    createTreeElements(fileInformation, rootFolder, fileInformation.path);
  });

  return [{
    ...rootFolder,
    children: sortTreeElements(rootFolder.children),
  }];
}
