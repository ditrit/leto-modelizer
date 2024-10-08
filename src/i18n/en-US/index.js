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
      search: 'Search',
      modify: 'Modify',
      rename: 'Rename',
      ok: 'Ok',
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
          label: 'Create Diagram',
          scratch: {
            name: 'From scratch',
            label: 'Create a diagram from scratch',
            title: 'Open a popup to create a diagram',
          },
          template: {
            name: 'From template',
            label: 'Create a diagram from a template',
            title: 'Open a popup to create a diagram from a template',
          },
          ai: {
            name: 'From AI',
            label: 'Create a diagram from AI',
            title: 'Open a popup to create a diagram from AI',
            error: 'Error during diagram creation: retry or change input',
          },
        },
        dialog: {
          name: 'Create new model',
        },
        form: {
          name: 'Model path',
          plugin: 'Model plugin',
          location: 'Model location',
          description: 'Describe your model for IA here',
        },
        notify: {
          success: 'Model has been created &#129395;!',
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
      search: 'Search a diagram',
      tag: {
        select: 'Filter by categories',
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
        rename: 'File is renamed &#129395;!',
        delete: 'File is deleted.',
        add: 'File is added &#129395;!',
      },
      folder: {
        create: 'Folder is created &#129395;!',
        rename: 'Folder is renamed &#129395;!',
        delete: 'Folder is deleted.',
      },
    },
  },
  errors: {
    empty: 'Please type something.',
    permissionsDenied: "You don't have the necessary role to perform this action.",
    invalid: {
      gitAddRemote: {
        repository: 'Invalid repository url.',
      },
      fileExplorer: {
        label: "The name must not contain any '/' characters.",
      },
    },
    projects: {
      duplicate: {
        import: 'Project already imported.',
        name: 'Project name already exists.',
      },
      delete: 'An error occured while deleting project.',
      create: 'An error occured while creating project.',
    },
    models: {
      duplicate: 'Model name already exists for this plugin.',
      notParsable: 'Model not parsable',
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
          rename: 'An error occured while renaming folder.',
          delete: 'An error occured while deleting folder.',
        },
        file: {
          create: 'An error occured while creating file.',
          rename: 'An error occured while renaming file.',
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
    authentication: {
      fetchingUserInformation: 'An error occured while fetching user data information',
      fetchingUserPermissions: 'An error occured while fetching user data permissions',
    },
  },
  error404: {
    title: '404',
    content: 'Oops. Nothing here...',
  },
  page: {
    splash: {
      wait: 'Please wait before using our awesome application!',
      info: 'We are loading the project\'s needs!',
      login: {
        success: 'You have been successfully logged in 🥳!',
      },
    },
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
        overwrite: 'Overwrite existing project',
      },
      template: {
        createProject: 'Create a project from a template',
        importProject: 'Import project with template',
        selected: 'Selected template: {template}',
        empty: 'No template available',
        import: 'In existing project (save your project in a repository)',
        rename: 'Rename this template for your project',
        description: 'Content',
        search: 'Search a template',
      },
      plugins: {
        title: 'Plugins',
      },
    },
    diagrams: {
      actions: {
        askAI: 'Ask AI',
        export: 'Export SVG',
        rearrange: 'Rearrange',
        zoomPlus: 'Zoom+',
        zoomMinus: 'Zoom-',
        delete: 'Trash',
        create: 'Create',
      },
    },
    models: {
      name: 'List of diagrams in the project',
      empty: 'No models available',
      template: {
        create: 'Create a diagram from a template',
        pluginsFilter: 'Filter by plugin',
        selectedPlugin: 'Selected plugin: {plugin}',
        selectedTemplate: 'Selected template: {template}',
      },
      table: {
        categories: 'Categories',
        diagramPath: 'Diagram path',
        plugin: 'Plugin',
        actionsTitle: 'Tools',
      },
      drawer: {
        title: 'Add a template of a model',
        search: 'Search a template of a model',
        list: 'Models templates',
        select: 'Languages...',
        empty: 'No template available',
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
        aichat: {
          title: 'Ask AI',
          settings: {
            title: 'Settings',
            delete: 'Delete conversation',
            typingEffect: 'Progressive Typing:',
          },
          sendMessage: 'Message to AI',
          moreMessages: 'Load more messages',
          dialog: {
            title: 'Confirm delete conversation',
            description: 'Are you sure you want to delete this conversation with the AI?<br/>This action is irreversible and the conversation history will be permanently removed.',
            confirmDelete: '',
          },
        },
        components: {
          header: 'Components definitions',
          filterLabel: 'Component filter',
          title: '{name} ({length})',
          empty: 'Nothing to display',
        },
        variables: {
          empty: 'No variables to display.',
          header: 'Variables',
          name: 'Name',
          value: 'Value',
        },
        tabs: {
          components: 'Components',
          variables: 'Variables',
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
        admin: {
          title: 'Administration',
        },
        user: {
          unknown: 'Unknown User',
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
        rename: {
          file: {
            title: 'Rename file',
            input: 'New file name',
          },
          folder: {
            title: 'Rename folder',
            input: 'New folder name',
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
    consoleFooter: {
      tabs: {
        errors: 'errors ({number})',
      },
      errorsTable: {
        message: 'Message',
        line: 'Start/End Line',
        file: 'File',
        column: 'Start/End Column',
        severity: 'Severity',
        component: 'Component',
        attribute: 'Attribute',
      },
    },
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
        hint: {
          array: 'Press enter to validate',
        },
      },
    },
  },
  tag: {
    local: 'Local',
    remote: 'Remote',
  },
  parser: {
    severity: {
      1: 'Hint',
      2: 'Info',
      4: 'Warning',
      8: 'Error',
    },
    error: {
      parsing: 'Error during parsing.\nInitial error message: "{ initialErrorMessage }".',
      invalidLinkType: 'Wrong type of link attribute, must be an Array.',
      invalidReferenceType: 'Wrong type of reference attribute, must be a String.',
      notBoolean: 'Wrong value type, must be a Boolean.',
      notString: 'Wrong value type, must be a String.',
      notNumber: 'Wrong value type, must be a Number.',
      notObject: 'Wrong value type, must be an Array.',
      notArray: 'Wrong value type, must be an Array.',
      required: 'Attribute "{attribute}" is required',
      minString: 'The string must have a minimum length of {extraData}.',
      minNumber: 'The number must be at least {extraData}.',
      minArray: 'The array must have at least {extraData} items.',
      maxString: 'The string must have a maximum length of {extraData}.',
      maxNumber: 'The number must be at most {extraData}.',
      maxArray: 'The array must have at most {extraData} items.',
      invalidValue: 'The value is not one of the default values.\nPossible default values are: {extraData}.',
      regex: 'The format of this value is invalid',
    },
    warning: {
      noComponentDefinition: 'Unreferenced component.',
    },
  },
};
