import ModelsPage from 'src/pages/ModelsPage.vue';
import { getProjectById } from 'src/composables/Project';

const ModelsRoute = {
  name: 'models',
  path: '/:projectName/models',
  component: ModelsPage,
  beforeEnter: (to, _from, next) => {
    const project = getProjectById(to.params.projectName);

    if (!project) {
      next({ name: 'Error' });
    } else {
      next();
    }
  },
};

export default ModelsRoute;
