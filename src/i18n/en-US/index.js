export default {
  application: {
    name: 'Leto Modelizer',
  },
  actions: {
    default: {
      goToHome: 'Go to homepage',
      save: 'Save',
    },
    home: {
      createEmptyProject: 'Create empty project',
    },
    git: {
      repository: {
        exists: 'We have access to your repository &#129395;!',
      },
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
    },
  },
};
