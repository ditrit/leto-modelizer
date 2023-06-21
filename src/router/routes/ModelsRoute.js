import { getProjectById } from 'src/composables/Project';

const ModelsRoute = {
  path: '/:projectName',
  component: () => import('layouts/ProjectLayout.vue'),
  children: [
    { name: 'models', path: '/:projectName/models', component: () => import('pages/ModelsPage.vue') },
  ],
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
