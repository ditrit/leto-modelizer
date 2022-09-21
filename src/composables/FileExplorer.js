/**
 * Create and add a new folder.
 * @param {String} id - Absolute path of folder.
 * @param {Array} folder - Folder that will receive an empty folder Object
 * @param {String} name - Name of the new folder.
 */
function createFolder(id, folder, name) {
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
 * @param {String} id - Absolute path of file.
 * @param {Array} folder - Folder that will receive an empty file Object
 * @param {String} name - Name of the new folder.
 */
function createFile(id, folder, name) {
  folder.push({
    id,
    icon: 'fa-regular fa-file',
    label: name,
    isFolder: false,
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
  elements.sort((x, y) => {
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
function sortTreeElements(elements) {
  sortElementsInFolder(elements);
  elements.filter((element) => element.children && element.children.length > 0)
    .forEach((element) => sortTreeElements(element.children));
  return elements;
}

/**
 * Convert fileInformation input to the Object required to display Quasar Tree Component
 * @param {FileInformation[]} fileInformationArray - Array to convert for Quasar Tree Component
 * Example: [{path: '/home/folderA/file1.tf'}, {path: '/home/folderA/file2.tf'}]
 * @returns {Array} - The array of nodes that designates the tree structure of Quasar Tree Component
 * @see https://quasar.dev/vue-components/tree
 */
export function getTree(fileInformationArray) {
  const tree = [];
  fileInformationArray.forEach((fileInformation) => {
    const splittedPath = fileInformation.path.split('/').filter(Boolean);
    splittedPath.forEach((pathName, index) => {
      const parentPath = splittedPath.slice(0, index);
      const parentFolderChildren = getTreeFolderChildrenFromPath(tree, parentPath);
      if (!parentFolderChildren.length
        || parentFolderChildren.every((child) => child.label !== pathName)) {
        if (index === splittedPath.length - 1) {
          createFile(fileInformation.path, parentFolderChildren, pathName);
        } else {
          createFolder(
            fileInformation.path
              .substr(0, fileInformation.path.indexOf(pathName) + pathName.length),
            parentFolderChildren,
            pathName,
          );
        }
      }
    });
  });

  return sortTreeElements(tree);
}
