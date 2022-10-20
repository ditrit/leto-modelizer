export default {
  application: {
    name: 'Leto Modelizer',
  },
  actions: {
    default: {
      goToHome: 'Go to homepage',
      save: 'Save',
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
      newBranchFrom: 'New branch from "{branch}"...',
      branch: {
        create: 'Branch is created &#129395;!',
        update: 'Branch is updated &#129395;!',
      },
      update: 'Update',
    },
    fileExplorer: {
      empty: 'No files available in project.',
    },
  },
  errors: {
    empty: 'Please type something',
    invalid: {
      gitProvider: {
        repository: 'Invalid repository url',
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
};
