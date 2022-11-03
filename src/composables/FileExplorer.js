/**
 * Create and add a new folder.
 * @param {String} id - Absolute path of folder.
 * @param {Array} folder - Folder that will receive an new empty folder.
 * @param {String} name - Name of the new folder.
 */
export function createFolder(id, folder, name) {
  folder.push({
    id,
    icon: 'fa-solid fa-folder',
    label: name,
    children: [],
    isFolder: true,
  });
}

/**
 * Create and add a new file.
 * @param {FileInformation} fileInformation - Absolute path of a file.
 * @param {Array} folder - Folder that will receive a new empty file.
 * @param {String} name - Name of the new file.
 * @param {Boolean} [isNewLocalFile=true] - True when the file is locally created otherwise false.
 */
export function createFile(fileInformation, folder, name, isNewLocalFile = true) {
  if (name === '__empty__') {
    return;
  }
  folder.push({
    id: fileInformation.path,
    icon: 'fa-regular fa-file',
    label: name,
    isFolder: false,
    isNewLocalFile,
    information: fileInformation,
  });
}

/**
 * Return folder children from a given array of path.
 * @param {Array} folders - Tree folders
 * @param {String[]} paths - Array of path
 * @return {Object} Chosen folder.
 */
function getTreeFolderChildrenFromPath(folders, paths) {
  const folder = folders.find((child) => child.label === paths[0]);
  if (folder) {
    if (paths.length > 1) {
      return getTreeFolderChildrenFromPath(folder.children, paths.slice(1));
    }
    return folder.children;
  }
  return folders;
}

/**
 * Sort elements by alphabetic order and sort to display folders before files
 * @param {Array} elements - Tree folders
 * @returns {Array} - Sorted Tree
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
 * Sort Tree root and nested elements
 * @param {Array} elements - Tree folders
 * @returns {Array} - Sorted Tree
 */
export function sortTreeElements(elements) {
  sortElementsInFolder(elements);
  elements.filter((element) => element.children && element.children.length > 0)
    .forEach((element) => sortTreeElements(element.children));
  return elements;
}

/**
 * Convert fileInformation input to the Object required to display Quasar Tree Component
 * @param {String} projectId - local project id
 * @param {FileInformation[]} fileInformationArray - Array to convert for Quasar Tree Component
 * Example: [{path: '/home/folderA/file1.tf'}, {path: '/home/file2.tf'}]
 * @returns {Array} - The array of nodes that designates the tree structure of Quasar Tree Component
 * @see https://quasar.dev/vue-components/tree
 */
export function getTree(projectId, fileInformationArray) {
  const tree = [];
  fileInformationArray.forEach((fileInformation) => {
    const splittedPath = fileInformation.path.split('/').filter(Boolean);
    splittedPath.forEach((pathName, index) => {
      const parentPath = splittedPath.slice(0, index);
      const parentFolderChildren = getTreeFolderChildrenFromPath(tree, parentPath);
      if (!parentFolderChildren.length
        || parentFolderChildren.every((child) => child.label !== pathName)) {
        if (index === splittedPath.length - 1) {
          createFile(
            fileInformation,
            parentFolderChildren,
            pathName,
            false,
          );
        } else {
          createFolder(
            fileInformation.path
              .substring(0, fileInformation.path.indexOf(pathName) + pathName.length),
            parentFolderChildren,
            pathName,
          );
        }
      }
    });
  });

  return [
    {
      id: projectId,
      icon: 'fa-solid fa-folder',
      label: projectId,
      isFolder: true,
      isRootFolder: true,
      children: sortTreeElements(tree),
    },
  ];
}
