export default {
  application: {
    name: 'Leto Modelizer',
  },
  actions: {
    default: {
      goToHome: 'Go to homepage',
      save: 'Save',
      delete: 'Delete',
      dropZoneMessage: 'Drop component/template here',
      show: {
        more: 'Show {number} more...',
        less: 'Show less',
      },
      create: 'Create',
      update: 'Update',
      cancel: 'Cancel',
    },
    home: {
      newProject: 'New project',
      importProject: 'Import project',
      createProject: 'Create project',
      importedProject: 'Project has been imported &#129395;!',
      createdProject: 'Project has been created &#129395;!',
      deleteProject: {
        title: 'Delete project',
        confirmDelete: 'Are you sure you want to delete {name} ?',
        success: 'Project has been deleted 😥',
      },
      renameProject: {
        title: 'Rename project',
        success: 'Project has been renamed 😉',
      },
    },
    models: {
      create: {
        button: {
          name: 'New model',
          title: 'Open dialog to create new model',
        },
        dialog: {
          name: 'Create new model',
        },
        form: {
          name: 'Model name',
          plugin: 'Model plugin',
        },
        notify: {
          success: 'Model has been created &#129395;!',
          eexist: 'Model with the same name and plugin already exist.',
          error: 'An error occured while creating model.',
        },
      },
      rename: {
        button: {
          title: 'Rename model',
        },
        dialog: {
          name: 'Rename model',
        },
        form: {
          name: 'Model name',
        },
        notify: {
          success: 'Model has been renamed &#129395;!',
          eperm: 'Model with the same name and plugin already exist.',
          error: 'An error occured while renaming model.',
        },
      },
      delete: {
        button: {
          title: 'Delete model',
        },
        dialog: {
          name: 'Delete model',
        },
        form: {
          message: 'Are you sure this model should be deleted ?',
        },
        notify: {
          success: 'Model has been deleted &#129395;!',
          error: 'An error occured while deleting model.',
        },
      },
      import: {
        dialog: {
          name: 'Import template model',
        },
        form: {
          name: 'Model name',
        },
        notify: {
          success: 'Model has been created &#129395;!',
          eexist: 'Model with the same name and plugin already exist.',
          error: 'An error occured while creating model.',
        },
      },
    },
    git: {
      repository: {
        exists: 'We have access to your repository &#129395;!',
      },
      authentication: {
        update: 'Git authentication updated &#129395;!',
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
      gitAddRemote: {
        repository: 'Invalid repository url',
      },
      fileExplorer: {
        label: 'The name must not contain any \'/ \' characters',
      },
    },
    projects: {
      duplicate: 'Project name already exists.',
      delete: 'An error occured while deleting project.',
      create: 'An error occured while creating project.',
    },
    models: {
      duplicate: 'Model name already exists for this plugin.',
    },
    templates: {
      getData: 'An error occured while fetching remote template data.',
    },
    git: {
      HttpError: 'Can\'t access the repository.',
      branch: {
        duplicate: 'Branch name already exists.',
      },
      cannotLockRef: 'Fatal: cannot lock reference.',
      CheckoutConflictError: 'Update not possible due to unstaged modification(s)',
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
    plugin: {
      object: 'Some attributes are incorrect',
    },
    renameProject: 'An error occured while renaming project.',
    rules: {
      required: 'Value is required.',
      string: {
        min: 'It should contain at least {min} character(s).',
        max: 'It should not contain more than {max} characters.',
        regexp: 'It should match the RegExp "{regexp}".',
      },
      number: {
        nan: 'It should be only numeric character(s)',
        min: 'It should be greater than or equal to {min}',
        max: 'It should be less than or equal to {max}',
      },
    },
  },
  error404: {
    title: '404',
    content: 'Oops. Nothing here...',
  },
  page: {
    home: {
      drawer: {
        empty: 'Nothing to display',
        projects: {
          title: 'Projects',
          recent: 'Recent projects',
        },
      },
      project: {
        recent: 'Recent projects',
        title: 'Choose your project',
        import: 'Import new project',
        create: 'Create a project',
        rename: 'Rename project',
        name: 'Project name',
        empty: 'No projects, please create a new project to have one here 😉',
        delete: 'Delete project',
      },
      template: {
        createProject: 'Create a project from a template',
        importProject: 'Import project with template',
        selected: 'Selected template: {template}',
        empty: 'No templates available',
        import: 'In existing project (save your project in a repository)',
        rename: 'Rename this template for your project',
        description: 'Content',
      },
      plugins: {
        title: 'Plugins',
      },
    },
    models: {
      name: 'List of Models',
      empty: 'No models available',
      template: {
        create: 'Create a model from a template',
        selectedPlugin: 'Selected plugin: {plugin}',
        selectedTemplate: 'Selected template: {template}',
      },
    },
    modelizer: {
      header: {
        switch: {
          draw: 'Draw',
          text: 'Text',
        },
        button: {
          upload: {
            label: 'Upload to Git',
            disable: {
              title: 'Please set git authentication to enable uploading.',
            },
            enable: {
              title: 'Click to upload you work to git.',
            },
            success: 'Uploaded successfully ! 😉',
            error: 'An error occured while uploading.',
          },
        },
      },
      button: {
        back: {
          label: 'Back to project page',
          title: 'Open project page',
        },
      },
      drawer: {
        components: {
          header: 'Components definitions',
          filterLabel: 'Component filter',
          title: '{name} ({length})',
          empty: 'Nothing to display',
        },
        templates: {
          title: 'Templates',
        },
        documentationLink: 'Link to the documentation',
      },
      settings: {
        gitAuthentication: {
          title: 'Git authentication',
          username: 'Username',
          token: 'Access token',
        },
        gitAddRemote: {
          title: 'Add remote repository',
          repository: 'Repository url',
          repositoryExample: 'Examples: "http://test.com/test" or "https://github.com/test"',
          warningMessage: 'Changing the remote can lead to conflicts and/or data loss',
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
          modified: 'Modified files:',
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
        filterParsableFiles: 'Show parsable files',
      },
    },
    about: {
      title: 'About Leto Modelizer',
      letoModelizer: {
        title: 'What is Leto Modelizer ?',
        description: 'It is a low code modelizer that works with external plugins for integration technology (terraform, jenkins, kubernetes...). The goal of Leto Modelizer is to become the standard tool for all developers to easily reuse and exploit the skills of architecture and/or DevOps experts.',
        github: 'Github repository',
      },
      ditrit: {
        title: 'DitRit association',
        description: 'DitRit, which stands for "Design it, Run it !", is a public interest association. It seeks to address the problems faced by companies in their implementation of Agile/DevOps approaches. In this context, DitRit develops and proposes open source solutions to illustrate its work.',
        github: 'Github organization',
        website: 'Ditrit.io',
      },
      team: {
        title: 'Main team',
      },
      sponsors: {
        title: 'Sponsors',
      },
    },
  },
  footer: {
    version: 'Version {version}',
    about: 'About',
  },
  menu: {
    git: {
      currentBranch: 'Current branch',
      localBranchesTitle: 'Local branches',
      remoteBranchesTitle: 'Remote branches',
      noBranches: 'Nothing to show.',
      loading: 'Loading branches',
    },
  },
  plugin: {
    component: {
      attribute: {
        id: 'id',
        name: 'value',
        value: 'value',
        save: 'save',
        reset: 'reset',
        title: 'Component details',
        forceSave: 'Allow saving with error field(s)',
        referenced: 'Referenced object attribute',
        unreferenced: 'Unreferenced object attribute',
        add: 'Add attribute',
        delete: 'Delete attribute',
        noAttributes: 'No attributes',
        section: 'Section name',
        url: 'Open documentation',
      },
    },
  },
  tag: {
    local: 'Local',
    remote: 'Remote',
  },
};
