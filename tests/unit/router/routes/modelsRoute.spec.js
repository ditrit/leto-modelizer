import ModelsRoute from 'src/router/routes/ModelsRoute';

jest.mock('src/composables/Project', () => ({
  getProjectById: (id) => {
    if (id === 'badProject') {
      return null;
    }
    return {
      id: 1,
    };
  },
}));

describe('Test route: ModelsRoute', () => {
  describe('Test function: beforeEnter', () => {
    it('should succeed and call next without paramaters', () => {
      const next = jest.fn();
      const to = {
        params: {
          projectName: 'projectNameTest',
        },
      };

      ModelsRoute.beforeEnter(to, null, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith();
    });

    it('should fail when project does not exist and call next with error page', () => {
      const next = jest.fn();
      const to = {
        params: {
          projectName: 'badProject',
        },
      };

      ModelsRoute.beforeEnter(to, null, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenLastCalledWith({ name: 'Error' });
    });
  });
});
