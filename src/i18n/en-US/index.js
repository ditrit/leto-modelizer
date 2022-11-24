export default {
  application: {
    name: 'Leto Modelizer',
  },
  actions: {
    default: {
      goToHome: 'Go to homepage',
      save: 'Save',
      delete: 'Delete',
      show: {
        more: 'Show {number} more...',
        less: 'Show less',
      },
      create: 'Create',
      update: 'Update',
    },
    home: {
      createEmptyProject: 'Create empty project',
    },
    git: {
      repository: {
        exists: 'We have access to your repository &#129395;!',
      },
      checkout: 'Checkout',
      newBranch: 'New branch',
      status: 'Status',
      newBranchFrom: 'New branch from "{branch}"...',
      branch: {
        create: 'Branch is created &#129395;!',
        update: 'Branch is updated &#129395;!',
        push: 'Branch is pushed &#129395;!',
      },
      update: 'Update',
      push: 'Push',
      commit: 'Commit',
      committed: 'Your files are committed &#129395;!',
      log: 'Log',
    },
    fileExplorer: {
      empty: 'No files available in project.',
      newFile: 'New file',
      newFolder: 'New folder',
      addFile: 'Add',
      file: {
        create: 'File is created &#129395;!',
        delete: 'File is deleted.',
        add: 'File is added &#129395;!',
      },
      folder: {
        create: 'Folder is created &#129395;!',
        delete: 'Folder is deleted.',
      },
    },
  },
  errors: {
    empty: 'Please type something',
    invalid: {
      gitProvider: {
        repository: 'Invalid repository url',
      },
      fileExplorer: {
        label: 'The name must not contain any \'/ \' characters',
      },
    },
    git: {
      HttpError: 'Can\'t access the repository.',
      branch: {
        duplicate: 'Branch name already exists.',
      },
      cannotLockRef: 'Fatal: cannot lock reference.',
      MergeNotSupportedError: 'The remote history has been force rewritten, we haven\'t implemented yet the rebase option(<code>git pull -r</code>).<br/>Please delete and checkout once again your branch.',
    },
    fileExplorer: {
      folder: {
        delete: 'You must confirm the deletion of the file and its content.',
      },
      label: {
        duplicate: 'This name already exists.',
      },
      default: {
        folder: {
          create: 'An error occured while creating folder.',
          delete: 'An error occured while deleting folder.',
        },
        file: {
          create: 'An error occured while creating file.',
          delete: 'An error occured while deleting file.',
          add: 'An error occured while adding file.',
        },
      },
    },
    rules: {
      required: 'Value is required.',
      string: {
        min: 'It should contain at least {min} character(s).',
        max: 'It should not contain more than {max} characters.',
        regexp: 'It should match the RegExp "{regexp}".',
      },
      number: {
        min: 'It should be greater than or equal to {min}',
        max: 'It should be less than or equal to {max}',
      },
    },
  },
  projects: {
    list: 'Projects list:',
    empty: 'No projects, please create a new project to have one here 😉',
  },
  error404: {
    title: '404',
    content: 'Oops. Nothing here...',
  },
  page: {
    modelizer: {
      header: {
        switch: {
          model: 'Model',
          text: 'Text',
        },
        button: {
          save: {
            label: 'Save',
            disable: {
              title: 'Please set git configuration to enable saving.',
            },
            enable: {
              title: 'Click to save you work.',
            },
            success: 'Saved successfully ! 😉',
            error: 'An error occured while saving.',
          },
        },
      },
      drawer: {
        components: {
          header: 'Components definitions',
        },
      },
      settings: {
        gitProvider: {
          title: 'Git configuration',
          repository: 'Repository url',
          repositoryExample: 'Examples: "http://test.com/test" or "https://github.com/test"',
          username: 'Username',
          token: 'Access token',
        },
      },
      git: {
        newBranch: {
          title: 'Create new branch',
          branch: 'New branch name',
          checkout: 'Checkout branch',
        },
        update: {
          title: 'Update',
          description: 'Do you want to update your branch <b>{branch}</b> ?',
          fastForward: 'Fast forward option (<code>git pull --ff</code>)',
        },
        status: {
          title: 'Git status',
          nothing: 'Nothing to validate, the working copy is clean!',
          staged: 'Staged files:',
          unstaged: 'Unstaged files:',
          untracked: 'Untracked files:',
        },
        commit: {
          title: 'Git commit',
          message: 'Commit message',
        },
        push: {
          title: 'Push',
          description: 'Do you want to push your branch <b>{branch}</b> ?',
          force: 'Force option (<code>git push -f origin {branch}</code>)',
        },
        log: {
          title: 'Log',
        },
      },
      fileExplorer: {
        create: {
          file: {
            title: 'Create a new file',
            input: 'New file name',
          },
          folder: {
            title: 'Create a new folder',
            input: 'New folder name',
          },
        },
        delete: {
          file: {
            title: 'Delete file',
            description: 'Are you sure you want to delete <b>{name}</b> file ?',
          },
          folder: {
            title: 'Delete folder',
            description: 'Are you sure you want to delete <b>{name}</b> folder ?',
            confirmDelete: 'Confirm deletion of folder and all its content',
          },
        },
      },
    },
  },
  menu: {
    git: {
      currentBranch: 'Current branch',
      localBranchesTitle: 'Local branches',
      remoteBranchesTitle: 'Remote branches',
      noBranches: 'Nothing to show.',
    },
  },
  plugin: {
    component: {
      attribute: {
        name: 'name',
        value: 'value',
        save: 'save',
        reset: 'reset',
        title: 'Component details',
        referenced: 'Referenced attributes',
        unreferenced: 'Unreferenced attributes',
        add: 'Add attribute',
        delete: 'Delete attribute',
        noAttributes: 'No attributes',
      },
    },
  },
};
