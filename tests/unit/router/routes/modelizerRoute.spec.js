import ModelizerRoute from 'src/router/routes/ModelizerRoute';

describe('Test routes: ModelizerRoutes', () => {
  describe('Test route: ModelizerLongRoute', () => {
    const ModelizerLongRoute = ModelizerRoute.children[0];

    it('should succeed and call next without paramaters', () => {
      const next = jest.fn();
      const to = {
        params: {
          projectName: 'projectNameTest',
          viewType: 'model',
        },
      };
      const projects = { projectNameTest: { id: 1 } };
      window.localStorage.setItem('projects', JSON.stringify(projects));

      ModelizerLongRoute.beforeEnter(to, null, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith();
    });

    it('should fail when project does not exist and call next with error page', () => {
      const next = jest.fn();
      const to = {
        params: {
          projectName: 'projectNameTest',
          viewType: 'model',
        },
      };
      window.localStorage.removeItem('projects');

      ModelizerLongRoute.beforeEnter(to, null, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith({ name: 'Error' });
    });

    it('should fail when viewType is not valid and call next with error page', () => {
      const next = jest.fn();
      const to = {
        params: {
          projectName: 'projectNameTest',
          viewType: 'test',
        },
      };
      const projects = { projectNameTest: { id: 1 } };
      window.localStorage.setItem('projects', JSON.stringify(projects));

      ModelizerLongRoute.beforeEnter(to, null, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith({ name: 'Error' });
    });
  });
});
